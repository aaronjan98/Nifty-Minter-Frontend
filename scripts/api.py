import io
import os
import warnings
from dotenv import load_dotenv
from IPython.display import display
from PIL import Image
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from datetime import datetime

from text_prompts import text_prompts

try:
    load_dotenv()
except:
    warnings.warn("Cannot load the environment file")

try:
    stability_api = client.StabilityInference(
        key=os.environ.get("STABILITY_KEY"),
        verbose=True,
    )
except KeyError:
    warnings.warn("STABILITY_KEY not found in environment")


def generate_and_save_image(input_prompt: str):
    """Submit a request to generate a single image from a text prompt"""

    # the object returned is a python generator
    answers = stability_api.generate(
        prompt=input_prompt,
        seed=34567,  # if provided, specifying a random seed makes results deterministic
        steps=20,  # defaults to 30 if not specified
    )

    # iterating over the generator produces the api response
    for resp in answers:
        for artifact in resp.artifacts:
            if artifact.finish_reason == generation.FILTER:
                warnings.warn(
                    "Your request activated the API's safety filters and could not be processed."
                    "Please modify the prompt and try again."
                )
            if artifact.type == generation.ARTIFACT_IMAGE:
                img = Image.open(io.BytesIO(artifact.binary))
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                img.save(f"../images/{timestamp}.png")
                print(f"image created {timestamp}.png")


if __name__ == "__main__":
    for prompt in text_prompts:
        generate_and_save_image(prompt)
