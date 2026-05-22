import torch
import torch.nn as nn
import json
import argparse
import os


class CNN(nn.Module):
    def __init__(self, num_classes, conv_filters, kernel_sizes, dropout):
        super(CNN, self).__init__()
        self.conv_layers = nn.ModuleList()
        in_channels = 1
        current_length = 253
        for i, (filters, k) in enumerate(zip(conv_filters, kernel_sizes)):
            self.conv_layers.append(
                nn.Conv2d(
                    in_channels=in_channels,
                    out_channels=filters,
                    kernel_size=(k, 4 if i == 0 else 1),
                    padding=(k // 2, 0),
                )
            )
            in_channels = filters
            self.conv_layers.append(nn.MaxPool2d(kernel_size=(2, 1), stride=(2, 1)))
            current_length //= 2
        self.dropout = nn.Dropout(dropout)
        self.fc1 = nn.Linear(conv_filters[-1] * current_length, 128)
        self.fc2 = nn.Linear(128, num_classes)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = x.view(-1, 1, 253, 4)
        for layer in self.conv_layers:
            x = self.relu(layer(x)) if isinstance(layer, nn.Conv2d) else layer(x)
        x = x.view(x.size(0), -1)
        x = self.relu(self.fc1(self.dropout(x)))
        x = self.fc2(self.dropout(x))
        return x


def convert(config_path, weights_path, output_path):
    with open(config_path) as f:
        config = json.load(f)

    num_classes = config["num_classes"]
    conv_filters = config["conv_filters"]
    kernel_sizes = config["kernel_sizes"]
    dropout = config["hyperparameters"]["dropout"]

    print(f"Building model: {num_classes} classes, {conv_filters} filters, {kernel_sizes} kernels, dropout={dropout}")

    model = CNN(num_classes, conv_filters, kernel_sizes, dropout)
    state = torch.load(weights_path, map_location="cpu")
    model.load_state_dict(state)
    model.eval()

    dummy = torch.randn(1, 1, 253, 4)
    torch.onnx.export(
        model,
        dummy,
        output_path,
        input_names=["input"],
        output_names=["output"],
        dynamo=False,
        opset_version=17,
    )
    # Clean up external data files if the exporter created them
    data_file = output_path + ".data"
    if os.path.exists(data_file):
        os.remove(data_file)
    print(f"Exported ONNX model to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert PyTorch GFP model to ONNX")
    parser.add_argument("config", help="Path to model config JSON")
    parser.add_argument("weights", help="Path to .pth weights file")
    parser.add_argument("--output", "-o", default=None, help="Output .onnx path")
    args = parser.parse_args()

    if args.output is None:
        base = os.path.splitext(os.path.basename(args.weights))[0]
        args.output = f"{base}.onnx"

    convert(args.config, args.weights, args.output)
