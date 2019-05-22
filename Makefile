compiled=./dist/drand.js

compile:
	@find ./javascript -type f -name "*.js" | xargs cat > $(compiled)
