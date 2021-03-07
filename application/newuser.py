"""
    returns all user in db
"""
import os
import json
import boto3

client = boto3.resource('dynamodb')

def lambda_handler(event, context):
    print(event)
    pl = json.loads(event["body"])
    table = client.Table(os.environ["TABLE_NAME"])
    resp = table.put_item(
        Item = {
            "userid": pl["userid"],
            "name": pl["name"]
        }
    )
    return {
        "body": "success",
        "headers": {
            "Content-Type": "text/plain"
        }
    }