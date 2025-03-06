<div style="text-align: center;">
    <img src="./logo.png" alt="Project Logo" width="300"/>
</div>

# mappers <!-- omit in toc -->

A simple and powerful library that will help you design the **layers** of your application correctly and ensure reliable mapping of your **entities**. This solution provides you with all the necessary tools to solve your class transformation tasks, providing a convenient declarative syntax and the ability to reliably validate the resulting instances.

## Documentation <!-- omit in toc -->

- [Installation](#installation)
- [Idea](#idea)
- [Simple using](#simple-using)
- [Glossary](#glossary)
- [Mapper](#mapper)
- [Profiles](#profiles)
- [Rules](#rules)
- [Validators](#validators)
- [Error description](#error-description)
- [Examples](#examples)

## Installation

Install `@mappers/core`:

```sh
npm i @mappers/core
```
| Framework | Package                          |
|-----------|-----------------------------------|
| Nest JS   | [NestJS Integration Library](https://github.com/placDev/mappers-nest)       |

## Idea
Help TypeScript developers build cleaner applications based on Object-Oriented Programming concepts with separation into layers that communicate through independent contracts.<br>
<br>
For example:<br>

| Presentation Layer                                                  | Domain Logic Layer                                                                          | Data Access Layer                                                                       |
|---------------------------------------------------------------------|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| DTO                                                                 | Domain                                                                                      | Entity                                                                                  |
| Layer of data transfer from <br/> controllers and their validation. | Layer of business logic. <br/> Models reflecting business <br/> entities and their methods. | Layer of data access.<br/> Isolates details of working <br/> with a database or cache.  |

Or any other set of layers you need :)

## Simple using

## Glossary
##### _1) Mapper_
##### _2) Profiles_
##### _3) Rules_
##### _4) Validators_

## Mapper
### _map_
### _autoMap_
### DI

## Profiles
### _define_
### DI

## Rules
### _addRule_
### _property_
### _properties_
### _complex_
### _byRule_
### _fill_
### _callConstructor_
### _validate_

## Validators
### Set default validator
### Set custom validator by Rule
### _validate_

## Errors description
### Settings Errors
- ```The function is only available when using the **TYPE** collect type```
### Profile Errors
- ```The object is not an inheritor of BaseMapperProfile```
- ```An instance of the profile '**PROFILE NAME**' has already been created```
### Rule Errors
- ```No rules found for '**FROM PROPERTY NAME**'```
- ```Rule for '**FROM PROPERTY NAME**' and '**TO PROPERTY NAME**' not found```
- ```The rule for '**FROM PROPERTY NAME**' and '**TO PROPERTY NAME**' has already been added to the mapper```
### Fill Errors
- ```The rule for the '**TO PROPERTY NAME**' property has already been added to the mapper```
- ```A rule has already been defined for the '**TO PROPERTY NAME**' property in 'properties' or 'complexity'```
### Validator Errors
- ```The object is not an inheritor of the BaseMapperValidator```
- ```An instance of the validator '**VALIDATOR NAME**' has already been created```
- ```The validator '**VALIDATOR NAME**' was not found```
- ```The default validator is not installed```
- ```The default or custom validator is not defined```
- ```The validator is disabled for this rule```
- ```There is no custom validator defined for the rule '**FROM PROPERTY NAME** and '**TO PROPERTY NAME**' and there is no default validator```

## Examples