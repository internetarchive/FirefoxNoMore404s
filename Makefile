BUILD_VERSION="1.4.1"

.PHONY: build
build:
	-rm ./build/*.xpi
	cd src &&	zip -r WaybackMachine_Firefox_V$(BUILD_VERSION).xpi ./*
	mv src/WaybackMachine_Firefox_V$(BUILD_VERSION).xpi ./build/WaybackMachine_Firefox_V$(BUILD_VERSION).xpi
