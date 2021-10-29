app_name=end_to_end_encryption

project_dir=$(CURDIR)/../$(app_name)
build_dir=$(CURDIR)/build/artifacts
sign_dir=$(build_dir)/sign

all: appstore

clean:
	rm -rf $(build_dir)
	rm -rf node_modules

appstore: clean
	mkdir -p $(sign_dir)
	rsync -a \
	--exclude=/build \
	--exclude=/doc \
	--exclude=/translationfiles \
	--exclude=/screenshots \
	--exclude=/.github \
	--exclude=/.tx \
	--exclude=/tests \
	--exclude=/vendor \
	--exclude=/.git \
	--exclude=/.github \
	--exclude=/l10n/l10n.pl \
	--exclude=/CONTRIBUTING.md \
	--exclude=/issue_template.md \
	--exclude=/README.md \
	--exclude=/.gitattributes \
	--exclude=/.php_cs.dist \
	--exclude=/.php_cs.cache \
	--exclude=/.gitignore \
	--exclude=/.scrutinizer.yml \
	--exclude=/.drone.yml \
	--exclude=/.travis.yml \
	--exclude=/composer.lock \
	--exclude=/composer.json \
	--exclude=/phpunit.xml \
	--exclude=/phpunit.integration.xml \
	--exclude=/Makefile \
	$(project_dir)/ $(sign_dir)/$(app_name)
	tar -czf $(build_dir)/$(app_name).tar.gz \
		-C $(sign_dir) $(app_name)
