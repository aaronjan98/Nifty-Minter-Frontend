import io
import os
import warnings
from dotenv import load_dotenv
import numpy as np
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation
from datetime import datetime

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


def generate_image(input_prompt: str):
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
                binary_data = io.BytesIO(artifact.binary)
                image_data = np.frombuffer(binary_data.read(), np.uint8)
                uint8array_data = np.asarray(image_data, dtype=np.uint8)
                print(uint8array_data)


if __name__ == "__main__":
    generate_image("rural village burning in blue flames")
