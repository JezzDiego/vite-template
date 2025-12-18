import {
	fixupConfigRules,
	fixupPluginRules,
	includeIgnoreFile
} from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import folders from "eslint-plugin-folders";
import jest from "eslint-plugin-jest";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import testingLibrary from "eslint-plugin-testing-library";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const gitignorePath = path.resolve(dirname, ".gitignore");
const compat = new FlatCompat({
	baseDirectory: dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default defineConfig([
	// Bring over selected legacy shareable configs via compat
	...fixupConfigRules(
		compat.extends(
			"airbnb",
			// Typescript-aware import plugin settings
			"plugin:import/typescript",
			// Prettier last
			"prettier"
		)
	),

	// Use unicorn's native flat config
	unicorn.configs["flat/recommended"],

	includeIgnoreFile(gitignorePath),
	globalIgnores(["dist"]),

	// Source files (TS/JS)
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		plugins: {
			folders,
			"unused-imports": unusedImports
		},
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			// React rules
			reactHooks.configs["recommended-latest"],
			// Vite fast-refresh rules
			reactRefresh.configs.vite
		],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: globals.browser
		},
		settings: {
			"import/resolver": {
				typescript: {
					noWarnOnMultipleProjects: true,
					project: [
						"./tsconfig.app.json",
						"./tsconfig.node.json",
						"./tsconfig.json"
					]
				}
			}
		},
		rules: {
			"class-methods-use-this": "off",
			"lines-between-class-members": "off",
			"no-unused-vars": "off",
			"react/jsx-props-no-spreading": "off",

			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_"
				}
			],

			"unused-imports/no-unused-imports": "error",

			"react/jsx-filename-extension": [
				"error",
				{
					extensions: [".tsx"]
				}
			],

			"import/extensions": [
				"error",
				"ignorePackages",
				{
					ts: "never",
					tsx: "never"
				}
			],

			"react/function-component-definition": [
				"error",
				{
					namedComponents: "arrow-function",
					unnamedComponents: "arrow-function"
				}
			],

			"no-use-before-define": "off",
			"@typescript-eslint/no-use-before-define": ["error"],
			"@typescript-eslint/consistent-type-definitions": ["error"],
			"unicorn/prevent-abbreviations": "off",
			"unicorn/no-null": "off",
			"no-shadow": "off",
			"unicorn/no-array-for-each": "off",
			"unicorn/no-array-reduce": "off",
			"unicorn/prefer-array-flat": "off",
			"unicorn/prefer-array-flat-map": "off",
			"unicorn/prefer-at": "off",
			"unicorn/prefer-set-has": "off",
			"unicorn/prefer-string-replace-all": "off",
			"unicorn/switch-case-braces": "off",
			"unicorn/no-negated-condition": "off",
			"react/require-default-props": "off",
			"unicorn/prefer-object-from-entries": "off",
			"no-lone-blocks": "off",
			curly: ["error", "all"],

			"no-restricted-syntax": [
				"error",
				{
					selector: "ForInStatement",
					message:
						"for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array."
				},
				{
					selector: "ForOfStatement",
					message:
						"iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations."
				},
				{
					selector: "LabeledStatement",
					message:
						"Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
				},
				{
					selector: "WithStatement",
					message:
						"`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
				},
				"BinaryExpression[operator='in']"
			],

			"sort-imports": [
				"error",
				{
					ignoreDeclarationSort: true
				}
			],

			"import/order": [
				"error",
				{
					groups: [
						["builtin", "external"],
						"internal",
						["parent", "sibling", "index"],
						"unknown"
					],

					pathGroupsExcludedImportTypes: ["object", "type"],
					"newlines-between": "always-and-inside-groups",

					alphabetize: {
						order: "asc",
						caseInsensitive: true
					},

					warnOnUnassignedImports: true
				}
			],

			"unicorn/no-unused-properties": "error",
			"unicorn/expiring-todo-comments": "off",
			"react/jsx-uses-react": "off",
			"react/react-in-jsx-scope": "off"
		}
	},
	{
		files: ["**/lib/**/*.tsx", "**/*.ts", "**/components/**/*.tsx"],

		rules: {
			"import/prefer-default-export": "off",
			"react/function-component-definition": "off",
			"react-refresh/only-export-components": "off",
			"react/jsx-no-constructed-context-values": "off",
			"unicorn/explicit-length-check": "off",
			"no-underscore-dangle": "off",
			"no-param-reassign": "off",
			"react/button-has-type": "off",
			"unicorn/no-document-cookie": "off",
			"@typescript-eslint/no-use-before-define": "off",
			"jsx-a11y/anchor-has-content": "off",
			"jsx-a11y/no-noninteractive-element-interactions": "off",
			"jsx-a11y/click-events-have-key-events": "off",
			"react/no-array-index-key": "off",
			eqeqeq: "off",
			"no-restricted-syntax": "off",
			"react/no-danger": "off",
			"consistent-return": "off",
			"react/no-unstable-nested-components": "off",
			"react/prop-types": "off"
		}
	},
	// Config files (Vite, etc.) — allow dev deps and relax Node-specific rules
	{
		files: [
			"**/*.config.{js,ts,mjs,cjs}",
			"vite.config.{ts,js}",
			"src/**/vite.config.{ts,js}"
		],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: globals.node
		},
		rules: {
			"import/no-extraneous-dependencies": ["error", { devDependencies: true }],
			"import/no-unresolved": "off",
			"unicorn/prefer-node-protocol": "off",
			"unicorn/prefer-module": "off"
		}
	},
	// Tests — apply Jest and Testing Library only here
	{
		files: ["**/*.test.{ts,tsx,js,jsx}", "**/*.spec.{ts,tsx,js,jsx}"],
		plugins: {
			jest: fixupPluginRules(jest),
			"testing-library": fixupPluginRules(testingLibrary)
		},
		extends: [
			...fixupConfigRules(
				compat.extends(
					"plugin:jest/recommended",
					"plugin:jest/style",
					"plugin:testing-library/react"
				)
			)
		],
		settings: {
			jest: { version: 29 }
		}
	}
]);
