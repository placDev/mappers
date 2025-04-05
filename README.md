<div style="text-align: center;">
    <img src="./logo.png" alt="Project Logo" width="300"/>
</div>

# mappers <!-- omit in toc -->
A fast, simple, and powerful library that helps you design your application **layers** correctly and ensures reliable mapping of your **entities**. The library actively uses TypeScript's **type checking capabilities** and the **pre-assembly** of mapping rules to achieve maximum speed and comfort for the developer. 
<br/>This solution provides you with all the necessary tools to solve class conversion problems, providing a convenient declarative syntax and the ability to reliably validate the resulting instances.

## Documentation <!-- omit in toc -->

- [Installation](#installation)
- [Idea](#idea)
- [Examples](#examples)
- [Glossary](#glossary)
- [Mapper](#mapper)
- [Profiles](#profiles)
- [Rules](#rules)
- [Validators](#validators)
- [Raw usage](#raw-usage)
- [Errors description](#errors-description)
- [Future changes](#future-changes)

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

## Examples
You can see the example by clicking on the link [Examples](https://github.com/placDev/mappers/tree/main/examples)

## Glossary
##### _1) Mapper_
The entity through which entity mapping operations are performed according to the specified rules.
```javascript
class OrdersService {
    async getAll(): Promise<Order[]> {
        const orderEntities: OrderEntity[] = await this.orderRepository.find();
        return this.mapper.map(orderEntities, OrderEntity, Order);
    }
}

class OrderController {
    async getAll(): Promise<OrderDto[]> {
        const orders: Order[] = await this.ordersService.getAll();
        return this.mapper.autoMap(orders, OrderDto);
    }
}
```
##### _2) Profiles_
The class through which mapping rules are assembled. We recommend creating profiles by grouping rules in them by related entities.<br/>
To work correctly, all your profiles must be **extended** from the **BasicMapperProfile**.<br/>
Please note that only one instance of a specific profile can be created, otherwise a **ProfileError** error will be thrown.
```javascript
class OrderProfile extends BaseMapperProfile {
    async define(mapper: ProfileMapperInterface) {
        mapper.addRule(OrderEntity, Order)
        // ...
        mapper.addRule(Order, OrderDto)
        // ...
    }
}
```

##### _3) Rules_
A specific mapping rule from one class to another, described in the profile. A single profile can contain multiple rules. Rules can refer to other rules when mapping nested objects.<br/>
Note that for one pair of classes (Order and OrderDto for example) There can only be one mapping rule in all profiles, otherwise a **RuleError** error will be thrown.
```javascript
class OrderProfile extends BaseMapperProfile {
    async define(mapper: ProfileMapperInterface) {
        mapper
            .addRule(OrderEntity, Order)
            .callConstructor()
            .properties((x) => [x.id, x.type])
            .property((x) => x.date, (x) => x.date)
            .byRule((x) => x.user, (x) => x.user, mapper.withRule(UserEntity, User))
            .validate(OrderValidator);
        
        mapper.addRule(Order, OrderDto)
        // ...
    }
}
```

##### _4) Validators_
A class that provides verification of each transformed object according to a custom scenario.
<br/>You can define a default validator (you don't have to pass an argument to .validate() for a rule) or define a custom validator for a specific rule.
<br/>To work correctly, all your validators must be **extended** from the **BaseMapperValidator**.
<br/>Note that the validator class can have only one instance, otherwise a **ValidatorError** error will be thrown.
```typescript
export class OrderValidator extends BaseMapperValidator {
    async validate(item: Order) {
        // Validation logic. Called for each object.
    }
}
```

## Mapper
### _map_
A method of the Mapper object that transforms an entity or an array of entities (**values**) through a rule that will be found through a pair of classes (**from** and **to**). 
<br/>If the conversion rule was not found, a **RuleError** error will be thrown.<br/>
_Examples_:
```typescript
await this.mapper.map(order, Order, OrderDto);
await this.mapper.map(orders, Order, OrderDto);
```
_Typing_:
```typescript
function map<V extends F, F, T>(values: V[], from: ConstructorType<F>, to: ConstructorType<T>): Promise<T[]>;
function map<V extends F, F, T>(values: V, from: ConstructorType<F>, to: ConstructorType<T>): Promise<T>;
```

### _autoMap_
It works in the same way as **map**, but the type we are converting from (the **values** or **from**) is calculated automatically.
<br/>You only need to specify the class to which the conversion should take place.
```typescript
await this.mapper.autoMap(order, OrderDto);
await this.mapper.autoMap(orders, OrderDto);
```
Typing:
```typescript
function autoMap<V, T>(values: V[], to: ConstructorType<T>): Promise<T[]>;
function autoMap<V, T>(values: V, to: ConstructorType<T>): Promise<T>;
```

## Profiles
### _define_
The method that will be called during the **collection** of profile data (at the start of the application). <br/>
Through it, mapping rules are registered via the **Mapper** object (passed in the argument **mapper**).
```typescript
class OrderProfile extends BaseMapperProfile {
    async define(mapper: ProfileMapperInterface) {
        mapper
            .addRule(OrderEntity, Order)
            .callConstructor(Order, (call, from) => call(0, null, from.name))
            .properties((x) => [x.id, x.type])
            .property((x) => x.age, (x) => x.age)
            .property((x) => x.date, (x) => x.date, async (_, from) => await this.dateService.get(from.id))
            .complex((x) => x.items, (x) => x.items)
            .fill(async (from) => await this.ownerService.getByOrderId(from.id), (x) => x.owner)
            .byRule((x) => x.user, (x) => x.user, mapper.withRule(UserEntity, User))
            .validate(OrderValidator);

        mapper.addRule(Order, OrderDto)
        // ...
    }
}
```

Typing:
```typescript
function define(mapper: ProfileMapperInterface): Promise<void>;
```

## Rules
### _addRule_
The method of registration of the mapping rule. Accepts two arguments **From** and **To**, which are constructor functions (classes). From is the type of input data (the ones we map), To is the type of output values (what we map). 
Please note that the application can have only one rule for one pair of **From** and **To**, otherwise a **RuleError** error will be thrown.
```typescript
mapper.addRule(FromClass, ToClass)
```
Typing:
```typescript
function addRule<F, T>(from: ConstructorType<F>, to: ConstructorType<T>): MapRule<F, T>;
```

### _property_
A method for mapping primitive properties of an object. The first argument (**propertyFrom**) determines which property to take the data from, and the second argument (**propertyTo**) determines where to place it. <br/>
The third optional argument is a transformer function that allows you to transform data from one property to another by changing its type and value. Accepts three optional arguments: the field value from the original object (**property**), the original object (**from**), and the object that is currently being mapped (**to**). The transformer function can be asynchronous.
```typescript
property((x) => x.name, (y) => y.name)
property((x) => x.name, (y) => y.name, () => 'Cats')
property((x) => x.name, (y) => y.name, async () => 'Cats')
property((x) => x.name, (y) => y.name, async (value) => `My ${value}`)
property((x) => x.name, (y) => y.name, async (value, from) => `My ${value} ${from.age}`)
```
Typing:
```typescript
function property<C>(propertyFrom: (value: Primitive<ClassFields<From>>) => C, propertyTo: (value: Primitive<ClassFields<To>>) => C): MapRule<From, To>;
function property<C, V>(propertyFrom: (value: Primitive<ClassFields<From>>) => C, propertyTo: (value: Primitive<ClassFields<To>>) => V, transform: (property: C, from: From, to: To) => Promise<NotVoid<V>>): MapRule<From, To>;
function property<C, V>(propertyFrom: (value: Primitive<ClassFields<From>>) => C, propertyTo: (value: Primitive<ClassFields<To>>) => V, transform: (property: C, from: From, to: To) => NotVoid<V>): MapRule<From, To>;
```

### _properties_
A method that allows you to conveniently map properties corresponding by **name** and **type**. The rule must specify an array of properties of the objects that need to be matched. This way, the values of the properties specified in the rule will be transferred to the final object without changes.<br/>
Please note that only **primitive** properties with the same type and name can be changed using this method.
```typescript
properties((x) => [x.name, x.age, x.isActive])
```
Typing:
```typescript
function properties(intersectionCallback: (intersection: IntersectionProperties<ClassFields<From>, ClassFields<To>>) => IntersectionProperty[]): MapRule<From, To>;
```
### _complex_
A method for defining mapping rules for **complex structures** (not primitives). It has two modes of operation: through deep cloning and transformers functions. The first argument (**propertyFrom**) determines which property to extract data from, and the second argument (**propertyTo**) determines where to put it. If the third argument is missing, the **deep optimized cloning** mode is used (implemented via the static **Cloner.deep()** method).
<br/>The third optional argument is the transformer function, through which you can implement custom data transformation logic. Accepts three optional arguments: the field value from the original object (**property**), the original object (**from**), and the object that is currently being mapped (**to**). The transformer function can be asynchronous. You can also use the deep cloning feature in it by importing the **Cloner** class from the package. The transformer function can be asynchronous. 
<br/>Please note that the application can have only one rule for one pair of From and To, otherwise a **RuleError** error will be thrown.
```typescript
complex((x) => x.ordersRaw, (y) => y.orders)
complex((x) => x.ordersRaw, (y) => y.orders, () => [new Order()])
complex((x) => x.ordersRaw, (y) => y.orders, async () => [new Order()])
complex((x) => x.ordersRaw, (y) => y.orders, async (value) => value.map(x => new Order(x)))
complex((x) => x.ordersRaw, (y) => y.orders, async (value, from) => {
    if(!from.isActive) {
        return [];
    }
    
    return value.map(x => new Order(x));
})
```
Typing:
```typescript
function complex<C, V extends C>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => V): MapRule<From, To>;
function complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => V, transform: (property: C, from: From, to: To) => Promise<NotVoid<N>>): MapRule<From, To>;
function complex<C, V, N extends V>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => C, propertyTo: (value: NonPrimitive<ClassFields<To>>) => V, transform: (property: C, from: From, to: To) => NotVoid<N>): MapRule<From, To>;
```

### _byRule_
This method is used if you need to transform an object or an array of objects with a prototype according to the rule. The specified rule can be added in another profile. The first argument (**propertyFrom**) determines which property to extract data from, and the second argument (**propertyTo**) determines where to put it, and the third argument (**rule**) should specify a pair of classes to find the mapping rule. 
<br/>If the specified rule is not found after all profiles are assembled, a **RuleError** exception will be thrown when the application is launched.
```typescript
byRule((x) => x.user, (x) => x.user, mapper.withRule(UserEntity, User))
byRule((x) => x.orders, (x) => x.orders, mapper.withRule(OrderEntity, Order))
```
Typing:
```typescript
function byRule<Z, D>(propertyFrom: (value: NonPrimitive<ClassFields<From>>) => Z, propertyTo: (value: NonPrimitive<ClassFields<To>>) => D, rule: ProxyRule<Z, D>): MapRule<From, To>;
```

### _fill_
A method that adds rules for **filling** in object properties that are **not present** in the original object. So you have a need, depending on some data at the mapping stage, to calculate the value (based on some properties of the source object, for example) which should be written to the property, you can add this rule.
<br/>The method takes two arguments: an asynchronous or synchronous function that will return the value that will be written to the property (**filler**) and a function that points to the property that should be filled (**propertyTo**). The filter function can take two arguments: the original object (**from**), and the object that is currently being mapped (**to**).
<br/>Please note that such rules have the **lowest priority**, and if the specified property is already specified in any of the rules, you will receive a **FillError** error at the profile assembly stage.
```typescript
fill(async (from) => await this.userRepository.find({ userId: from.userId }), (x) => x.user)
fill(() => Math.random(), (x) => x.randomNumber)
```
Typing:
```typescript
function fill<Z>(filler: (from: From, to: To) => Promise<NotVoid<Z>> | NotVoid<Z>, propertyTo: (value: ClassFields<To>) => Z): MapRule<From, To>;
```

### _callConstructor_
This method allows you to add a rule that, when mapping, will call the prototype constructor that is being converted **to**. This can be especially useful if your entity has some logic that needs to be called in the class constructor. Remember that this rule has a **low priority**.
<br/>
<br/>This rule is presented in two modes:
<br/>1) If the constructor has no parameters (call **callConstructor()** without arguments).
<br/>2) If the constructor has parameters or before calling the constructor, it is necessary to perform some logic, the first argument (**toConstructor**) must be passed to the type class in which the conversion is taking place and the second argument (**callConstructorCallback**).
<br/>
<br/>A **callConstructorCallback** is a function (synchronous or asynchronous) in which you can describe the logic before creating an object. The function takes two arguments: the function (**call**) that must be called to start creating an object (it takes the same arguments as the class constructor function) and the initial object (**from**).

```typescript
class OrderDto {
    constructor(age: number, name:string) {
        //...
    }
}
//...

callConstructor()
callConstructor(OrderDto, async (call, from) => {
    call(from.age, from.name);
})
```
Typing:
```typescript
function callConstructor(): MapRule<From, To>;
function callConstructor<ToConstructor extends ConstructorType<To>>(toConstructor: ToConstructor, callConstructorCallback: CallConstructorCallback<ToConstructor, From>): MapRule<From, To>;
```

### _validate_
The method indicates the need for validation of mapping results. When calling with an empty argument, the default validator specified in the settings will be used.
<br/>The function argument (**validator**) points to a class that should implement the validation logic specifically for this entity. Note that the specified validator must extend the **BaseMapperValidator**.
```typescript
validate()
validate(SomeMapperValidator)
```
Typing:
```typescript
function validate<T extends BaseMapperValidator>(): MapRule<From, To>;
function validate<T extends BaseMapperValidator>(validator: MapperValidator<T, To>): MapRule<From, To>;
```

## Validators
### Set default validator
```typescript
MapperSettings.setSettings({
    defaultValidator: DefaultMapperValidator,
});
```

### Set custom validator by Rule
```typescript
class OrderProfile extends BaseMapperProfile {
    async define(mapper: ProfileMapperInterface) {
        mapper
            .addRule(OrderEntity, Order)
            // ...
            .validate(OrderValidator);
    }
}
```

### _validate_
The method that will be called for each object that has been mapped. It must be typed according to the types of the rule in which it is defined.
```typescript
export class OrderValidator extends BaseMapperValidator {
    async validate(item: Order) {
        // Validation logic. Called for each object.
    }
}
```
Typing:
```typescript
function validate(item: any): Promise<void>
```

## Raw usage
If you want to use libraries without framework integrations or write your own integration, you can use a low-level flow.

### Without DI
```typescript
MapperSettings.setSettings({
    defaultValidator: DefaultMapperValidator, // Installing the default validator
});

MapperSettings.addProfile(SomeProfile); // Adding the mapping profile constructor function
MapperSettings.addCustomValidatorInstance(new SomeMapperValidator()); // Defining a custom validator

MapperSettings.collectProfiles(); // We collect and optimize profiles when launching the application

mapper = MapperSettings.getMapper(); // Getting the mapper
```

### For DI
Please note, when working in the **CollectType.DI** an attempt to reinitialize objects extending **BaseMapperProfile** or **BaseMapperValidator** will be ignored.
<br/>All instances extending **BaseMapperProfile** and **BaseMapperValidator** should use **scope singleton**, both for themselves and for the dependencies that are injected into them. This is necessary for the proper operation of **optimization** processes that run when the application is launched.
```typescript
MapperSettings.setSettings({
    collectType: CollectType.DI,
    defaultValidator: DefaultMapperValidator, // Installing the default validator
});

// Registering dependencies via DI
// It is necessary for DII to create profile instances and validators

MapperSettings.collectProfileInstances(); // Adding profiles to the mapper, the instances of which were created via DI

mapper = MapperSettings.getMapper(); // Getting the mappe
```

## Errors description
### Settings Errors
- ```The function is only available when using the **TYPE** collect type```<br/>
It will be thrown out if you try to use a function with an inappropriate type of mapper settings. For example, if in **CollectType.DI** mode you are trying to call MapperSettings.collectProfiles().

### Profile Errors
- ```The object does not extend the BaseMapperValidator```<br/>
It will be thrown if the class specified as the profile does not extend the base class **BaseMapperProfile**.
- ```An instance of the profile '**PROFILE NAME**' has already been created```<br/>
It will be thrown if you try to recreate an instance of a profile that has already been created before.

### Rule Errors
- ```No rules found for '**FROM NAME**'```<br/>
It will be thrown if you are trying to start mapping an object for which no mapping rules have been defined to other prototypes.
- ```Rule for '**FROM PROPERTY NAME**' and '**TO PROPERTY NAME**' not found```<br/>
The rule for mapping entities based on the specified prototype was not registered when building profiles. Double-check the correctness of the definition of rules and the assembly of profiles when launching the application.
- ```The rule for '**FROM PROPERTY NAME**' and '**TO PROPERTY NAME**' has already been added to the mapper```<br/>
It will be thrown out if you try to add a rule through the profile for a couple of prototypes, the rule for which has already been added earlier.
### Fill Errors
- ```The rule for the '**TO PROPERTY NAME**' property has already been added to the mapper```<br/>
It will be thrown if you are trying to define a rule for filling in a property for which a fill rule has already been added.
- ```A rule has already been defined for the '**TO PROPERTY NAME**' property in 'properties' or 'complexity'```<br/>
  It will be thrown if mapping rules of the **properties** or **complexity** type have already been defined for this property. The rules for definitions via fill have the **lowest priority**.
### Validator Errors
- ```The object does not extend the BaseMapperValidator```<br/>
It will be thrown if the class specified as the validator (for example, in .validate()) does not extend (or inherit) the base class of validators, **BaseMapperValidator**.
- ```An instance of the validator '**VALIDATOR NAME**' has already been created```<br/>
An error will be thrown if you try to recreate the validator instance.
- ```The validator '**VALIDATOR NAME**' was not found```<br/>
An error will be thrown if in the method .validate(SomeValidator) the validator whose instance has not yet been created is specified. Double-check whether this validator is registered in DI.
- ```The default validator is not installed```<br/>
An error will be thrown if the default validator has not been installed (via MapperSettings.setSettings) and the rule has been registered .validate() without specifying a custom validator.
- ```The default or custom validator is not defined```<br/>
It will be thrown if no default or custom validator has been installed, or the c rule has been registered .validate().
- ```The validator is disabled for this rule```
- ```There is no custom validator defined for the rule '**FROM PROPERTY NAME** and '**TO PROPERTY NAME**' and there is no default validator```

## Future changes
### 1.1.0
- Dynamic assembly of mapping rules
Allows you to use more than just Singleton scope for DI
- Performance improvement