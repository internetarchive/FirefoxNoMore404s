BUILD_VERSION="1.4.3"

# CREDENTIALS should have the following variables set:
# JWT_ISSUER="x"
# JWT_SECRET="x"
include CREDENTIALS


.PHONY: build_only
build_only:
	-rm ./build/*.zip
	npm run build_only
	mv build/wayback_machine-$(BUILD_VERSION).zip build/Wayback_Machine_Firefox_V$(BUILD_VERSION).zip
	git add build/*.zip

.PHONY: sign
sign:
	npm run sign -- --api-key=$(JWT_ISSUER) --api-secret=$(JWT_SECRET)

.PHONY: build
build: build_only sign
