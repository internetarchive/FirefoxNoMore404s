BUILD_VERSION="1.4.3"

# CREDENTIALS should have the following variables set:
# JWT_ISSUER="x"
# JWT_SECRET="x"
include CREDENTIALS


.PHONY: build_only
build_only:
	-rm ./build/*.xpi
	web-ext build --source-dir=src --artifacts-dir=build
	mv build/wayback_machine-$(BUILD_VERSION).xpi build/Wayback_Machine_Firefox_V$(BUILD_VERSION).xpi
	git add *.xpi

.PHONY: sign
sign:
	web-ext sign -s=src -a=build --api-key=$(JWT_ISSUER) --api-secret=$(JWT_SECRET)

.PHONY: build
build: build_only sign
