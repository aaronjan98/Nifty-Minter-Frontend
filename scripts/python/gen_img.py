import sys
import warnings
from stability_sdk import client
import stability_sdk.interfaces.gooseai.generation.generation_pb2 as generation


def generate_image(input_prompt: str, stability_key: str):
    """Submit a request to generate a single image from a text prompt"""

    try:
        stability_api = client.StabilityInference(
            key=stability_key,
            verbose=True,
        )
    except KeyError:
        warnings.warn("STABILITY_KEY not found in environment")

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
                sys.stdout.buffer.write(artifact.binary)
                sys.stdout.flush()


if __name__ == "__main__":
    function_name = sys.argv[1]
    input_prompt = sys.argv[2]
    api_key = sys.argv[3]

    if function_name == "generate_image":
        generate_image(input_prompt, api_key)
