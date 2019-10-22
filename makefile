BRANCH ?= jessica-node-player-fix
CONTAINER ?= twt-apps30
resourceGroup ?= live-igniteapps30
subName ?= "Ignite The Tour"
webappName ?= liveigniteapps30
acrName ?= liveigniteapps30acr
sqlDBName ?= liveapps30twtsql

.PHONY: clean

clean:
	-make docker-clean
	-make az-clean

docker-clean:
	docker rm -f $(CONTAINER)

az-clean:
	-az webapp delete --resource-group $(resourceGroup) --name $(webappName)
	-az appservice plan delete --resource-group $(resourceGroup) --name $(webappName) -y