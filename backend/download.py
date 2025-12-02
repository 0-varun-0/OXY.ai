# backend/download.py

import os
from huggingface_hub import snapshot_download

# ❗ CHANGE THIS to YOUR model repo when ready:
# Example for your fine-tuned model:
# REPO_ID = "your-hf-username/vilt-vqa-radiology"
REPO_ID = "dandelin/vilt-b32-finetuned-vqa"   # placeholder: public model

HERE = os.path.dirname(__file__)
MODEL_DIR = os.path.join(HERE, "models", "vilt_vqa_ft")
MARKER_FILE = os.path.join(MODEL_DIR, ".model_ready")

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    print(f"Downloading model: {REPO_ID}")
    snapshot_download(
        repo_id=REPO_ID,
        local_dir=MODEL_DIR,
        local_dir_use_symlinks=False
    )

    with open(MARKER_FILE, "w") as f:
        f.write(f"model={REPO_ID}\n")

    print(f"Model downloaded & ready at: {MODEL_DIR}")

if __name__ == "__main__":
    main()
