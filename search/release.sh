apk add jq
curl -s \
-X GET "$MEILI_HTTP_ADDR/keys" \
-H "Authorization: Bearer $MEILI_MASTER_KEY" \
| jq -r '.results[] | select(.name == "Default Admin API Key") | .key'