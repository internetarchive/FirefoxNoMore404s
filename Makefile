# CREDENTIALS should have the following variables set:
# JWT_ISSUER="x"
# JWT_SECRET="x"
include CREDENTIALS

# Note sign uploads to FF and downloads the signed plugin
.PHONY: sign
sign:
	npm run sign -- --api-key=$(JWT_ISSUER) --api-secret=$(JWT_SECRET)
