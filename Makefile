.PHONY: build
build:
	-rm ./build/FirefoxNoMore404s.xpi
	cd src &&	zip -r FirefoxNoMore404s.xpi ./*
	mv src/FirefoxNoMore404s.xpi ./build/FirefoxNoMore404s.xpi
