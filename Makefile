# CREDENTIALS should have the following variables set:
# JWT_ISSUER="x"
# JWT_SECRET="x"
include CREDENTIALS

# Use "run" for local development
.PHONY: run
run:
	web-ext run -s=src --pre-install

# Only use this if you need to produce an unsigned xpi. Use "run" for development
.PHONY: build_unsigned
build_unsigned:
	-mkdir build_unsigned
	-rm ./build_unsigned/*unsigned.xpi
	web-ext build --source-dir=src --artifacts-dir=build_unsigned

# Note sign uploads to FF and downloads the signed plugin
.PHONY: sign
sign:
	-rm ./build/*.xpi
	web-ext sign --verbose -s=src -a=build --api-key=$(JWT_ISSUER) --api-secret=$(JWT_SECRET)
	git add *.xpi
