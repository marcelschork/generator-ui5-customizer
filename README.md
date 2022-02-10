# generator-ui5-customizer

This repo showcases possible use cases for **customizing existing [ui5-community templates](https://github.com/ui5-community)** by implementing a sample Yeoman generator that can either be invoked via **[easy-ui5](https://github.com/SAP/generator-easy-ui5)** or running standlone.

## Embedded usage

```markdown
npm install -g yo generator-easy-ui5
yo easy-ui5 --addGhOrg=marcelschork
```

## Standalone usage

```markdown
npm install -g yo marcelschork/generator-ui5-customizer
yo ui5-customizer
```

## Use cases

The sample customizing generator demononstrate the following use cases:

- create additional files (config files for CI pipelines, vulnerability scanners, static code analysis tools, ... )
- overwrite existing files (`.eslintrc`, `.prettierrc`, ...)
- extend existing files (`package.json`, `ui5.yaml`, ...)
- extend the template with reuse modules (ODataPromiseModel, ErrorHandler, ...)
