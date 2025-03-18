import openai


openai.api_type = "Microsoft.CognitiveServices/accounts"
openai.api_base = "https://dottieconversations.openai.azure.com/" 
openai.api_version = "2021-04-30" 
openai.api_key = "1EudQ92SMQO14cbdUBWdo1h8lqxR0RQM5mUhNdfDN2AliYZiwq3gJQQJ99BCACBsN54XJ3w3AAABACOGWnMd"  


response = openai.ChatCompletion.create(
    engine="YOUR_DEPLOYMENT_NAME",  
    messages=[
        {"role": "system", "content": "You are Dottie, a friendly period assistant."},
        {"role": "user", "content": "What is a normal period cycle?"}
    ],
    max_tokens=100
)

print(response["choices"][0]["message"]["content"])
