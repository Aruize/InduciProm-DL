# GFP Expression Predictor

> **Language / Idioma / Hizkuntza:** [English](#english) | [Español](#español) | [Euskara](#euskara)

---

## English

Browser-based tool that predicts GFP expression from *E. coli* inducible promoter DNA sequences using CNN models. Runs entirely client-side via ONNX Runtime Web.

This is a screening tool for evaluating promoter variants before experimental validation. Predictions are computational estimates, and experimental confirmation is required to verify promoter activity.

### Features

- Click individual bases in the wild-type sequence to introduce mutations.
- Type mutations in text format (e.g. `A52T, G103C`).
- Two conditions: **UNINDUCED** (0% L-arabinose, 2 classes) and **INDUCED** (0.2% L-arabinose, 3 classes).
- Visual confidence bars for each class prediction.
- Dark/light mode toggle.
- Fully responsive layout.

---

## Español

Herramienta basada en navegador que predice la expresión de GFP a partir de secuencias de ADN de promotores inducibles de *E. coli* usando modelos CNN. Se ejecuta completamente en el cliente mediante ONNX Runtime Web.

Esta es una herramienta de cribado para evaluar variantes de promotores antes de la validación experimental. Las predicciones son estimaciones computacionales, y se requiere confirmación experimental para verificar la actividad del promotor.

### Características

- Haz clic en bases individuales de la secuencia de tipo silvestre para introducir mutaciones.
- Escribe mutaciones en formato de texto (por ejemplo, `A52T, G103C`).
- Dos condiciones: **NO INDUCIDO** (0% L-arabinosa, 2 clases) e **INDUCIDO** (0.2% L-arabinosa, 3 clases).
- Barras visuales de confianza para cada predicción de clase.
- Selector de modo oscuro/claro.
- Diseño completamente adaptable.

---

## Euskara

Nabigatzailean oinarritutako tresna da, *E. coli* bakterioaren promotore induzigarrien DNA sekuentzietatik GFP adierazpena CNN ereduen bidez iragartzen duena. Guztiz bezeroan exekutatzen da ONNX Runtime Web erabiliz.

Hau baheketa-tresna bat da, promotore-aldaerak baliozkotze esperimentala egin aurretik ebaluatzeko. Iragarpenak estimazio konputazionalak dira, eta promotorearen jarduera egiaztatzeko berrespen esperimentala behar da.

### Ezaugarriak

- Basa motako sekuentziako base indibidualetan klik egin mutazioak sartzeko.
- Idatzi mutazioak testu-formatuan (adibidez, `A52T, G103C`).
- Bi baldintza: **INDUZITU GABEA** (%0 L-arabinosa, 2 klase) eta **INDUZITUA** (%0.2 L-arabinosa, 3 klase).
- Klase bakoitzaren iragarpenerako konfiantza-barra bisualak.
- Modu iluna/argia aldatzeko aukera.
- Diseinu guztiz moldagarria.