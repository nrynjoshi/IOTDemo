# Define the azure rem
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.101.0"
    }
  }
}

# Define the Azure provider
provider "azurerm" {
  subscription_id = ""
  client_id = ""
  client_secret = ""
  tenant_id = ""
  features {}
}

# Define the Azure resource group
resource "azurerm_resource_group" "datavisualization" {
  name     = "datavisualization-resource-group"
  location = "East US"
}

# Define the Azure app service plan
resource "azurerm_app_service_plan" "datavisualization" {
  name                = "datavisualization-app-service-plan"
  location            = azurerm_resource_group.datavisualization.location
  resource_group_name = azurerm_resource_group.datavisualization.name
  kind                = "Linux"
  reserved            = true

  sku {
    tier = "Basic"
    size = "B1"
  }
}

# Define the Azure app service
resource "azurerm_app_service" "datavisualization" {
  name                = "ElderDataVisualization"
  location            = azurerm_resource_group.datavisualization.location
  resource_group_name = azurerm_resource_group.datavisualization.name
  app_service_plan_id = azurerm_app_service_plan.datavisualization.id
}

# Define the Azure storage account
resource "azurerm_storage_account" "datavisualization" {
  name                     = "visualizationdataset"
  resource_group_name      = azurerm_resource_group.datavisualization.name
  location                 = azurerm_resource_group.datavisualization.location
  account_tier             = "Standard"
  account_replication_type = "GRS"

  tags = {
    environment = "staging"
  }
}