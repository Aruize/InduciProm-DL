# GFP Expression Predictor

Browser-based tool that predicts GFP expression from promoter E. coli DNA sequences using CNN models. Runs entirely client-side via ONNX Runtime Web.

This is a screening tool for evaluating promoter variants before experimental validation. Predictions are computational estimates and experimental confirmation is required to verify promoter activity.

## Features

- Click individual bases in the wild-type sequence to introduce mutations
- Type mutations in text format (e.g. `A52T, G103C`)
- Two conditions: UNINDUCED (0% L-arabinose, 2 classes) and INDUCED (0.2% L-arabinose, 3 classes)
- Visual confidence bars for each class prediction
- Dark/light mode toggle
- Fully responsive layout