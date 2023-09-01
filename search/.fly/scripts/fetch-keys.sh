echo "fetching keys"

curl -Ss \
            -X GET $MEILI_HTTP_ADDR/keys \
            -H "Authorization: Bearer $MEILI_MASTER_KEY"


# curl -Ss \
#     -X POST $MEILI_HTTP_ADDR/keys \
#     -H "Authorization: Bearer $MEILI_MASTER_KEY" \
#     -H "Content-Type: application/json" \
#     --data-binary '{
#         "name": "Frontend key",
#         "actions": ["search", "documents.get"],
#         "indexes": ["*"],
#         "expiresAt": null
#     }'