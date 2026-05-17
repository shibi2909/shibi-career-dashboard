/* data/topicGuides.js — per-topic detailed guides (v4: 6-card bilingual format) */
window.SHIBI_TOPIC_GUIDES = {
  java: {
    "Basics & Syntax": {
      overview: "Java is a strongly-typed, object-oriented language that runs on the JVM. Every program starts from a main() method inside a class. Understanding data types, operators, and control flow is the bedrock of all Java development.",
      subtopics: [
        {
          name: "Variables and Data Types",
          explanation: "Java has 8 primitive types: byte, short, int, long, float, double, boolean, char. Reference types like String and arrays are stored on the heap. Type casting allows conversion between compatible types.",
          beginnerSummary: { en: "Variables store data. Java has 8 primitive types and reference types like String. Always choose the right type to save memory and avoid bugs.", ml: "വേരിയബിളുകൾ ഡേറ്റ സൂക്ഷിക്കുന്നു. Java-ൽ 8 primitive types ഉം String പോലുള്ള reference types ഉം ഉണ്ട്. ശരിയായ type തിരഞ്ഞെടുക്കുക." },
          howToStudy: { en: ["Learn all 8 primitive types with their sizes and ranges", "Practice declaring and initializing variables of each type", "Understand implicit vs explicit type casting", "Write a program using all types together"], ml: ["എല്ലാ 8 primitive types ഉം അവയുടെ size, range സഹിതം പഠിക്കുക", "ഓരോ type-ഉം declare ചെയ്ത് initialize ചെയ്ത് practice ചെയ്യുക", "Implicit vs explicit casting മനസ്സിലാക്കുക"] },
          interviewConcepts: { en: ["What is the difference between int and Integer in Java?", "Why is String immutable in Java?", "What is autoboxing and unboxing?", "What is the default value of instance variables?"], ml: ["int ഉം Integer ഉം തമ്മിലുള്ള വ്യത്യാസം എന്ത്?", "String immutable ആണ് എന്തുകൊണ്ട്?", "Autoboxing, unboxing എന്നാൽ എന്ത്?"] },
          commonMistakes: { en: ["Confusing == with .equals() for String comparison", "Integer overflow: storing values beyond int range", "Forgetting that char uses single quotes, String uses double quotes"], ml: ["String compare ചെയ്യാൻ == ഉപയോഗിക്കൽ തെറ്റ്, .equals() ഉപയോഗിക്കുക", "int range കടന്ന value store ചെയ്യുമ്പോൾ overflow ഉണ്ടാകും"] },
          practiceTips: { en: ["Write a unit converter (kg to lbs, °C to °F) using all numeric types", "Practice type casting by converting between int, double, and long", "Build a mini form that stores name (String), age (int), GPA (double)"], ml: ["Unit converter ഉണ്ടാക്കി practice ചെയ്യുക", "int, double, long ഇടയിൽ casting practice ചെയ്യുക"] },
          beginnerTasks: ["Declare one variable of each primitive type","Write a program using all arithmetic operators","Convert int to double and back with casting"],
          practice: ["Build a simple unit converter (kg to lbs, °C to °F)","Write a program that checks if a number is positive, negative, or zero","Create a simple calculator with Scanner input"],
          miniChallenge: "Build a currency converter that takes an amount and converts between USD, EUR, and INR.",
          interviewQs: ["What is the difference between int and Integer in Java?","Why is String immutable in Java?","What is autoboxing and unboxing?"]
        },
        {
          name: "Control Flow",
          explanation: "if-else and switch-case make decisions. for, while, and do-while loops repeat blocks. break exits a loop early, continue skips to the next iteration. Enhanced for-each loop simplifies array and collection iteration.",
          beginnerSummary: { en: "Control flow lets your program make decisions and repeat actions. if-else chooses paths, loops repeat code, and break/continue control loop execution.", ml: "Control flow ഉപയോഗിച്ച് program തീരുമാനങ്ങൾ എടുക്കുന്നു, code repeat ചെയ്യുന്നു. if-else, loops, break/continue എന്നിവ core tools ആണ്." },
          howToStudy: { en: ["Master if-else and nested if-else with real examples", "Learn switch-case for multi-way branching", "Practice for, while, do-while loops separately", "Understand when to use break vs continue"], ml: ["if-else ഉം nested if-else ഉം real examples ഉപയോഗിച്ച് പഠിക്കുക", "Switch-case multi-way branching-ന് പഠിക്കുക", "for, while, do-while loops separately practice ചെയ്യുക"] },
          interviewConcepts: { en: ["When would you use switch over if-else?", "What is the difference between while and do-while?", "How does the enhanced for-each loop work internally?", "What is fall-through in switch statements?"], ml: ["switch vs if-else എപ്പോൾ ഉപയോഗിക്കും?", "while ഉം do-while ഉം തമ്മിലുള്ള വ്യത്യാസം?", "Enhanced for-each loop internally എങ്ങനെ പ്രവർത്തിക്കുന്നു?"] },
          commonMistakes: { en: ["Missing break in switch causing fall-through", "Infinite loops due to wrong loop condition", "Off-by-one errors in for loops (< vs <=)"], ml: ["Switch-ൽ break miss ആകൽ fall-through ഉണ്ടാക്കും", "Loop condition തെറ്റായതുമൂലം infinite loop ഉണ്ടാകും"] },
          practiceTips: { en: ["Print all primes from 1-100 using nested loops", "Build a grade calculator using if-else chains", "Implement FizzBuzz — classic interview warm-up"], ml: ["1-100 prime numbers print ചെയ്യുക", "Grade calculator ഉണ്ടാക്കി practice ചെയ്യുക"] },
          beginnerTasks: ["Write a grade calculator using if-else","Write a days-of-week printer using switch","Print multiplication tables using nested loops"],
          practice: ["Print all prime numbers from 1 to 100","FizzBuzz with customizable rules","Pascal's triangle generator"],
          miniChallenge: "Write a mini ATM simulation — enter PIN, check balance, deposit, withdraw — using switch and loops.",
          interviewQs: ["When would you use switch over if-else?","What is the difference between while and do-while?","How does the enhanced for-each loop work internally?"]
        },
        {
          name: "Methods",
          explanation: "Methods encapsulate reusable logic. A method has an access modifier, return type, name, parameters, and body. Java uses pass-by-value for primitives and pass-by-value of the reference for objects. Method overloading allows multiple methods with the same name but different signatures.",
          beginnerSummary: { en: "Methods are reusable blocks of code. Java passes primitives by value and objects by reference value. Overloading lets you use the same method name with different parameters.", ml: "Methods reusable code blocks ആണ്. Java primitives pass-by-value ആയും objects reference-by-value ആയും pass ചെയ്യുന്നു. Overloading same name, different params allow ചെയ്യുന്നു." },
          howToStudy: { en: ["Write methods with different return types (void, int, String)", "Practice method overloading with 3+ variations", "Understand pass-by-value with primitives vs objects", "Learn recursion with factorial and Fibonacci"], ml: ["Different return types ഉള്ള methods എഴുതി practice ചെയ്യുക", "Method overloading 3+ variations ഉണ്ടാക്കുക", "Recursion factorial, Fibonacci ഉപയോഗിച്ച് പഠിക്കുക"] },
          interviewConcepts: { en: ["What is method overloading? How is it different from overriding?", "Can you override a static method in Java?", "What is the difference between return and void?", "How does Java handle pass-by-value for objects?"], ml: ["Overloading vs overriding വ്യത്യാസം?", "Static method override ചെയ്യാൻ കഴിയുമോ?"] },
          commonMistakes: { en: ["Confusing method overloading (compile-time) with overriding (runtime)", "Calling run() directly instead of start() on threads", "Forgetting that Java is always pass-by-value, even for objects"], ml: ["Overloading vs overriding confuse ആകൽ", "Objects pass-by-reference ആണ് എന്ന് തെറ്റിദ്ധരിക്കൽ"] },
          practiceTips: { en: ["Build a MathUtils class with 8 helper methods", "Write iterative vs recursive Fibonacci and compare performance", "Create a StringUtils class with reverse, isPalindrome, countVowels"], ml: ["MathUtils class 8 helper methods ഉണ്ടാക്കുക", "Iterative vs recursive Fibonacci compare ചെയ്യുക"] },
          beginnerTasks: ["Write a factorial() method using loops","Write a method that checks if a string is a palindrome","Write an overloaded add() for int, double, and String"],
          practice: ["Build a MathUtils class with 8 helper methods","Write recursive Fibonacci vs iterative and compare","Create StringUtils with reverse, isPalindrome, countVowels"],
          miniChallenge: "Build a number guessing game using methods for input, validation, and feedback.",
          interviewQs: ["What is method overloading? How is it different from overriding?","Can you override a static method in Java?","What is the difference between return and void?"]
        }
      ]
    },
    "OOP": {
      overview: "Object-Oriented Programming (OOP) is the core paradigm of Java. The four pillars — Encapsulation, Inheritance, Polymorphism, and Abstraction — allow you to model real-world systems cleanly. Every placement interview tests OOP concepts deeply.",
      subtopics: [
        {
          name: "Class & Object",
          explanation: "A class is a blueprint. An object is an instance created with `new`. Every object has state (fields) and behavior (methods). The `this` keyword refers to the current instance. Constructor is called when an object is created.",
          beginnerSummary: { en: "A class is a blueprint; an object is a real instance of it. Every object has its own state (fields) and behavior (methods). Think of class as a cookie cutter and object as the cookie.", ml: "Class ഒരു blueprint ആണ്; object അതിന്റെ ഒരു real instance ആണ്. Class cookie cutter പോലെ, object cookie പോലെ." },
          howToStudy: { en: ["Define a class with fields and methods", "Create multiple objects from the same class", "Use `this` keyword to resolve naming conflicts", "Understand constructor chaining with this()"], ml: ["Fields ഉം methods ഉം ഉള്ള class define ചെയ്യുക", "Same class-ൽ നിന്ന് multiple objects ഉണ്ടാക്കുക", "`this` keyword naming conflict resolve ചെയ്യാൻ ഉപയോഗിക്കുക"] },
          interviewConcepts: { en: ["What is the difference between a class and an object?", "What is a constructor? Can a constructor be private?", "What is the purpose of the `this` keyword?", "What is a static vs instance member?"], ml: ["Class ഉം object ഉം തമ്മിലുള്ള വ്യത്യാസം?", "Constructor private ആകാൻ കഴിയുമോ?"] },
          commonMistakes: { en: ["Forgetting to use `new` when creating objects", "Confusing static members with instance members", "Not calling super() first in subclass constructor"], ml: ["Object create ചെയ്യുമ്പോൾ `new` forget ആകൽ", "Static vs instance members confuse ആകൽ"] },
          practiceTips: { en: ["Build a Library system with Book and Member classes", "Design a Student class with grades array and GPA calculation", "Create a Company holding a list of Employee objects"], ml: ["Library system Book, Member classes ഉണ്ടാക്കുക", "Student class grades ഉം GPA calculation ഉം ഉൾക്കൊള്ളിക്കുക"] },
          beginnerTasks: ["Create a Car class with brand, speed, and drive() method","Instantiate 3 Car objects with different brands","Use `this` keyword to differentiate instance and parameter names"],
          practice: ["Build a Library system with Book and Member classes","Design a Student class with grades, GPA calculation","Create a Company class that holds a list of Employee objects"],
          miniChallenge: "Build a simple bank account system: Account class with account number, balance, deposit(), withdraw(), and getBalance().",
          interviewQs: ["What is the difference between a class and an object?","What is a constructor? Can a constructor be private?","What is the purpose of the `this` keyword?"]
        },
        {
          name: "Inheritance",
          explanation: "Inheritance lets a subclass inherit fields and methods from a superclass using `extends`. The `super` keyword accesses the parent class. Java supports single inheritance for classes. A subclass can override parent methods to change behavior.",
          beginnerSummary: { en: "Inheritance lets a child class reuse the code of a parent class. Use `extends` to inherit. Use `super` to call the parent's constructor or method. Java allows single inheritance only for classes.", ml: "Inheritance child class-ന് parent class-ന്റെ code reuse ചെയ്യാൻ അനുവദിക്കുന്നു. `extends` ഉപയോഗിക്കുക. Java single inheritance മാത്രം allow ചെയ്യുന്നു." },
          howToStudy: { en: ["Create a base class with common fields/methods", "Extend it in 2-3 subclasses", "Override methods in each subclass", "Use super() to call parent constructor"], ml: ["Common fields/methods ഉള്ള base class ഉണ്ടാക്കുക", "2-3 subclasses-ൽ extend ചെയ്യുക", "super() parent constructor call ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between extends and implements?", "Can Java have multiple inheritance? Why not?", "What is the diamond problem and how does Java solve it?", "What methods are NOT inherited from a parent class?"], ml: ["extends ഉം implements ഉം തമ്മിലുള്ള വ്യത്യാസം?", "Java multiple inheritance allow ചെയ്യുന്നുണ്ടോ?"] },
          commonMistakes: { en: ["Trying to inherit from multiple classes (Java doesn't allow it)", "Forgetting to call super() when parent has no default constructor", "Overriding without using @Override annotation (typos go undetected)"], ml: ["Multiple classes-ൽ നിന്ന് inherit ചെയ്യാൻ ശ്രമിക്കൽ", "@Override annotation ഇല്ലാതെ override ചെയ്യൽ"] },
          practiceTips: { en: ["Build Shape → Circle, Rectangle, Triangle with area()", "Create Employee → Manager, Developer with bonus calculation", "Design Vehicle → Car, Truck with different fuel types"], ml: ["Shape hierarchy ഉണ്ടാക്കി area() override ചെയ്യുക", "Employee → Manager, Developer bonus calculation ഉൾക്കൊള്ളിക്കുക"] },
          beginnerTasks: ["Create an Animal class and extend it with Dog and Cat","Use super() to call the parent constructor","Override toString() in a subclass"],
          practice: ["Build a shape hierarchy: Shape → Circle, Rectangle, Triangle with area()","Create Employee → Manager, Developer subclasses with bonus calculation","Design a Vehicle → Car, Truck, Motorcycle hierarchy"],
          miniChallenge: "Build a multi-level hierarchy: LivingThing → Animal → Mammal → Dog, with each level adding specific behavior.",
          interviewQs: ["What is the difference between extends and implements?","Can Java have multiple inheritance?","What is the diamond problem and how does Java solve it?"]
        },
        {
          name: "Polymorphism",
          explanation: "Polymorphism means 'many forms'. Compile-time polymorphism is method overloading. Runtime polymorphism is method overriding through inheritance. A parent reference can point to a child object, and the overridden method is called at runtime.",
          beginnerSummary: { en: "Polymorphism allows one interface to work with many types. Overloading is compile-time polymorphism; overriding is runtime polymorphism. A parent reference can hold any child object.", ml: "Polymorphism ഒരു interface പല types-ൽ പ്രവർത്തിക്കാൻ allow ചെയ്യുന്നു. Overloading compile-time, overriding runtime polymorphism ആണ്." },
          howToStudy: { en: ["Demonstrate overloading with same method name, different params", "Create Animal[] array holding Dog, Cat, Bird objects", "Call overridden method through parent reference", "Understand dynamic method dispatch"], ml: ["Same method name, different params overloading demonstrate ചെയ്യുക", "Animal[] array-ൽ Dog, Cat, Bird objects store ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between compile-time and runtime polymorphism?", "Can you override a private method in Java?", "What is dynamic method dispatch?", "What is the role of @Override annotation?"], ml: ["Compile-time vs runtime polymorphism വ്യത്യാസം?", "Private method override ചെയ്യാൻ കഴിയുമോ?"] },
          commonMistakes: { en: ["Thinking overloading is runtime polymorphism (it's compile-time)", "Overriding static methods (it's method hiding, not overriding)", "Casting parent reference to wrong child type causing ClassCastException"], ml: ["Overloading runtime polymorphism ആണ് എന്ന് തെറ്റിദ്ധരിക്കൽ", "Static methods override ആണ് method hiding ആണ് എന്ന് confuse ആകൽ"] },
          practiceTips: { en: ["Build a drawing app: Shape[] holds Circle/Rectangle, call draw() polymorphically", "Create a Payment system: CreditCard/PayPal/UPI all implement pay()", "Design a notification system: Email/SMS/Push all implement send()"], ml: ["Shape[] array-ൽ Circle, Rectangle store ചെയ്ത് draw() call ചെയ്യുക", "Payment system polymorphism ഉൾക്കൊള്ളിക്കുക"] },
          beginnerTasks: ["Demonstrate overloading with a calculate() method","Override speak() in Dog, Cat, Bird extending Animal","Store subtypes in Animal[] and call speak() polymorphically"],
          practice: ["Build a drawing app where Shape[] holds Circle/Rectangle and calls draw()","Create a Payment system with CreditCard/PayPal/UPI","Design a notification system with Email/SMS/Push implementations"],
          miniChallenge: "Build a simple game: Character base class, Warrior and Mage extend it, each with unique attack() and defend(). Call polymorphically.",
          interviewQs: ["What is the difference between compile-time and runtime polymorphism?","Can you override a private method in Java?","What is dynamic method dispatch?"]
        },
        {
          name: "Abstraction",
          explanation: "Abstraction hides implementation details and shows only essential features. Abstract classes can have both abstract and concrete methods and cannot be instantiated. Abstract methods must be overridden in concrete subclasses.",
          beginnerSummary: { en: "Abstraction hides complexity and shows only what's necessary. Abstract classes provide partial implementation; subclasses fill in the rest. You cannot create an object of an abstract class directly.", ml: "Abstraction complexity hide ചെയ്ത് essential features മാത്രം കാണിക്കുന്നു. Abstract class partially implement ആണ്; subclass ബാക്കി fill ചെയ്യുന്നു." },
          howToStudy: { en: ["Create an abstract class with abstract and non-abstract methods", "Implement it in 2 concrete subclasses", "Try to instantiate the abstract class — see the error", "Compare with interface to understand when to use each"], ml: ["Abstract ഉം non-abstract methods ഉള്ള abstract class ഉണ്ടാക്കുക", "2 concrete subclasses-ൽ implement ചെയ്യുക"] },
          interviewConcepts: { en: ["When do you use abstract class vs interface?", "Can an abstract class have a constructor?", "Can an abstract class have non-abstract methods?", "Can an abstract class implement an interface?"], ml: ["Abstract class vs interface എപ്പോൾ ഉപയോഗിക്കും?", "Abstract class-ന് constructor ഉണ്ടാകാൻ കഴിയുമോ?"] },
          commonMistakes: { en: ["Trying to instantiate an abstract class directly", "Not implementing all abstract methods in the concrete subclass", "Using abstract class when interface would be the better design choice"], ml: ["Abstract class directly instantiate ചെയ്യാൻ ശ്രമിക്കൽ", "Concrete subclass-ൽ abstract methods implement ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["Design abstract PaymentProcessor with process(), refund() abstract methods; implement for Stripe and PayPal", "Build abstract Vehicle with abstract fuelType(); implement Car and Truck", "Create abstract Database with abstract connect(); implement MySQLDB"], ml: ["PaymentProcessor abstract class Stripe ഉം PayPal ഉം implement ചെയ്ത് practice ചെയ്യുക"] },
          beginnerTasks: ["Create an abstract Shape with abstract area() and concrete display()","Implement area() in Circle and Rectangle subclasses","Try to instantiate an abstract class and see the error"],
          practice: ["Design abstract Vehicle with abstract fuelType()","Build abstract Employee with abstract calculateBonus()","Create abstract Database with abstract connect() and concrete executeQuery()"],
          miniChallenge: "Build abstract PaymentProcessor with process() and refund() abstract methods. Implement for Stripe and PayPal with different logic.",
          interviewQs: ["When do you use an abstract class vs interface?","Can an abstract class have a constructor?","Can an abstract class have non-abstract methods?"]
        },
        {
          name: "Encapsulation",
          explanation: "Encapsulation bundles data and methods into a single unit and restricts direct field access using access modifiers. Use private fields with public getters/setters. This prevents invalid state and protects internal data.",
          beginnerSummary: { en: "Encapsulation keeps data safe by making fields private and providing controlled access through getters/setters. It prevents external code from putting objects into invalid states.", ml: "Encapsulation fields private ആക്കി getters/setters through controlled access provide ചെയ്യുന്നു. External code invalid state ഉണ്ടാക്കുന്നത് prevent ചെയ്യുന്നു." },
          howToStudy: { en: ["Make all fields private in a BankAccount class", "Add getter and setter for each field", "Add validation in setter to reject invalid values", "Test that invalid values are correctly rejected"], ml: ["BankAccount class-ൽ all fields private ആക്കുക", "ഓരോ field-നും getter, setter add ചെയ്യുക", "Setter-ൽ validation add ചെയ്ത് invalid values reject ചെയ്യുക"] },
          interviewConcepts: { en: ["Why is encapsulation important?", "What is the difference between public, private, protected, and default access?", "Can you access a private member using reflection?", "What is the benefit of getter/setter over public fields?"], ml: ["Encapsulation എന്തുകൊണ്ട് important?", "public, private, protected, default access modifiers വ്യത്യാസം?"] },
          commonMistakes: { en: ["Making getters/setters without any validation (defeats the purpose)", "Making fields public for convenience — breaks encapsulation", "Creating getter and setter for every field blindly (some should be read-only)"], ml: ["Validation ഇല്ലാതെ getter/setter ഉണ്ടാക്കൽ", "Convenience-ന് fields public ആക്കൽ encapsulation break ചെയ്യും"] },
          practiceTips: { en: ["Build Temperature class: setting Celsius auto-updates Fahrenheit", "Create Circle class: setting radius auto-recalculates area", "Design UserProfile with validated email (must contain @) and age (0-150)"], ml: ["Temperature class ഉണ്ടാക്കി Celsius set ചെയ്യുമ്പോൾ Fahrenheit auto-update ചെയ്യുക"] },
          beginnerTasks: ["Make all fields in BankAccount private and add getters/setters","Add validation in setBalance() to reject negative values","Use encapsulation in a Student class"],
          practice: ["Build a Temperature class where Celsius auto-updates Fahrenheit","Create a Circle class where setting radius auto-recalculates area","Design a UserProfile with validated email and age setters"],
          miniChallenge: "Build a VehicleRegistration system where plate number is set only at creation, speed only within legal limits, and fuel decreases with distance.",
          interviewQs: ["Why is encapsulation important?","What is the difference between public, private, protected, and default?","Can you access a private member using reflection?"]
        },
        {
          name: "Interfaces",
          explanation: "An interface is a contract — it declares methods that implementing classes must provide. From Java 8, interfaces can have default and static methods. A class can implement multiple interfaces, enabling a form of multiple inheritance.",
          beginnerSummary: { en: "An interface defines a contract of methods that classes must implement. Unlike abstract classes, a class can implement multiple interfaces. Java 8 added default and static methods to interfaces.", ml: "Interface methods-ന്റെ contract define ചെയ്യുന്നു. Abstract class-ൽ നിന്ന് വ്യത്യസ്തമായി, ഒരു class multiple interfaces implement ചെയ്യാൻ കഴിയും." },
          howToStudy: { en: ["Define a Flyable interface with fly() method", "Implement it in Bird and Airplane classes", "Implement multiple interfaces in a single class", "Explore Java 8 default methods in interfaces"], ml: ["Flyable interface fly() method ഉൾക്കൊള്ളിച്ച് define ചെയ്യുക", "Bird ഉം Airplane ഉം implement ചെയ്യുക", "Single class multiple interfaces implement ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between interface and abstract class?", "Can an interface have a constructor?", "What are default methods in Java 8 interfaces?", "Can an interface extend another interface?"], ml: ["Interface vs abstract class വ്യത്യാസം?", "Java 8 default methods എന്ത്?"] },
          commonMistakes: { en: ["Thinking interfaces cannot have any implementation (Java 8 changed this)", "Not implementing all interface methods in the class", "Using interface for everything — sometimes abstract class is more appropriate"], ml: ["Java 8-ൽ interfaces-ന് implementation ഉണ്ടാകാൻ കഴിയും", "All interface methods implement ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["Build smart home: Switchable, Dimmable, Schedulable interfaces; SmartBulb implements all three", "Design Sortable and Filterable for a data processor", "Create Printable and Exportable for a report system"], ml: ["SmartBulb Switchable, Dimmable, Schedulable implement ചെയ്യുക"] },
          beginnerTasks: ["Create a Flyable interface with fly() method, implement in Bird and Plane","Create a Drawable interface, implement in Circle and Rectangle","Implement multiple interfaces in a single class"],
          practice: ["Build a Sortable and Filterable interface for a data processor","Design a Printable and Exportable interface for a report system","Create a Notifiable interface implemented by Email, SMS, and Push"],
          miniChallenge: "Build a smart home system: define Switchable, Dimmable, and Schedulable interfaces. Create SmartBulb that implements all three.",
          interviewQs: ["What is the difference between interface and abstract class?","Can an interface have a constructor?","What are default methods in Java 8 interfaces?"]
        }
      ]
    },
    "Collections": {
      overview: "The Java Collections Framework provides ready-made data structures: List (ordered, duplicates allowed), Set (unordered, no duplicates), Map (key-value pairs), Queue (FIFO), and Deque (double-ended). Choosing the right collection is key in interviews.",
      subtopics: [
        {
          name: "ArrayList & LinkedList",
          explanation: "ArrayList is backed by a dynamic array — O(1) random access but O(n) insert/delete in middle. LinkedList is a doubly-linked list — O(n) access but O(1) insert/delete if you have the node. Use ArrayList for read-heavy, LinkedList for insert/delete-heavy workflows.",
          beginnerSummary: { en: "ArrayList is like a resizable array — fast to read by index. LinkedList is a chain of nodes — fast to insert/delete. Pick the right one based on your most frequent operation.", ml: "ArrayList resizable array പോലെ ആണ് — index-ൽ fast read. LinkedList nodes-ന്റെ chain ആണ് — insert/delete fast. ഏറ്റവും frequent operation-ന് അനുസരിച്ച് തിരഞ്ഞെടുക്കുക." },
          howToStudy: { en: ["Create ArrayList and LinkedList with the same data", "Compare performance of get(i) vs add(0,x) for both", "Practice sorting ArrayList with Collections.sort()", "Use LinkedList as a queue with offer() and poll()"], ml: ["ArrayList ഉം LinkedList ഉം same data-ൽ compare ചെയ്യുക", "get() vs add() performance compare ചെയ്യുക"] },
          interviewConcepts: { en: ["When would you use LinkedList over ArrayList?", "How does ArrayList grow internally?", "What is the time complexity of ArrayList.get() vs LinkedList.get()?", "What is the difference between Iterator and ListIterator?"], ml: ["LinkedList vs ArrayList എപ്പോൾ ഉപയോഗിക്കും?", "ArrayList internally എങ്ങനെ grow ചെയ്യുന്നു?"] },
          commonMistakes: { en: ["Using LinkedList when ArrayList would be faster (LinkedList has higher memory overhead)", "Modifying a list while iterating it (ConcurrentModificationException)", "Not specifying initial capacity for large ArrayLists"], ml: ["LinkedList-ന്റെ memory overhead കൂടുതൽ, ArrayList prefer ചെയ്യുക", "Iterate ചെയ്യുമ്പോൾ list modify ചെയ്യൽ exception ഉണ്ടാക്കും"] },
          practiceTips: { en: ["Build a student grade manager using ArrayList", "Implement a browser history (back/forward) using a LinkedList as Deque", "Sort an ArrayList of Employee objects by salary using Comparator"], ml: ["Student grade manager ArrayList ഉപയോഗിച്ച് ഉണ്ടാക്കുക", "Browser history LinkedList Deque ഉപയോഗിച്ച് implement ചെയ്യുക"] },
          beginnerTasks: ["Create an ArrayList of Strings, add, remove, and iterate","Create a LinkedList and use addFirst(), addLast()","Sort an ArrayList using Collections.sort()"],
          practice: ["Build a student grade manager using ArrayList","Implement a browser history using a LinkedList","Sort an ArrayList of Employee objects by salary"],
          miniChallenge: "Build a playlist manager: add songs, remove by name, move a song to the top, shuffle the list.",
          interviewQs: ["When would you use LinkedList over ArrayList?","How does ArrayList grow internally?","What is the time complexity of ArrayList.get() vs LinkedList.get()?"]
        },
        {
          name: "HashMap & HashSet",
          explanation: "HashMap stores key-value pairs with O(1) average lookup. Keys must be unique; values can repeat. HashSet uses HashMap internally to store unique elements. Iteration order is not guaranteed. Use entrySet() to iterate over all entries.",
          beginnerSummary: { en: "HashMap stores key-value pairs with fast O(1) lookup. HashSet stores unique values using HashMap internally. Both have no guaranteed order. Use LinkedHashMap when insertion order matters.", ml: "HashMap key-value pairs O(1) lookup-ൽ store ചെയ്യുന്നു. HashSet unique values store ചെയ്യുന്നു. Order guarantee ഇല്ല. Insertion order വേണമെങ്കിൽ LinkedHashMap ഉപയോഗിക്കുക." },
          howToStudy: { en: ["Build a word frequency counter using HashMap", "Use HashSet to find duplicates in an array", "Iterate HashMap with entrySet() and keySet()", "Understand equals() and hashCode() contract"], ml: ["Word frequency counter HashMap ഉപയോഗിച്ച് ഉണ്ടാക്കുക", "Array duplicates find ചെയ്യാൻ HashSet ഉപയോഗിക്കുക"] },
          interviewConcepts: { en: ["How does HashMap handle collisions?", "What is the default initial capacity and load factor of HashMap?", "What happens if you use a mutable object as a HashMap key?", "What is the difference between HashMap and LinkedHashMap?"], ml: ["HashMap collisions എങ്ങനെ handle ചെയ്യുന്നു?", "Mutable object HashMap key ആയി ഉപയോഗിച്ചാൽ?"] },
          commonMistakes: { en: ["Not overriding hashCode() when overriding equals() — breaks HashMap", "Using HashMap in multi-threaded code without synchronization", "Relying on iteration order of HashMap (use LinkedHashMap if order matters)"], ml: ["equals() override ചെയ്യുമ്പോൾ hashCode() override ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["Build a phone book (name → number) with add, update, delete, search", "Check if two strings are anagrams using character frequency HashMap", "Find the first non-repeating character using LinkedHashMap"], ml: ["Phone book HashMap ഉപയോഗിച്ച് ഉണ്ടാക്കുക", "Anagram check character frequency HashMap ഉപയോഗിച്ച് ചെയ്യുക"] },
          beginnerTasks: ["Build a word frequency counter using HashMap","Find duplicates in an array using HashSet","Iterate a HashMap with entrySet() and print key-value pairs"],
          practice: ["Build a phone book with add, update, delete, search","Count character frequency in a string using HashMap","Check if two strings are anagrams using HashSet"],
          miniChallenge: "Build a simple LRU cache: HashMap with max size 5 — when full, remove the oldest entry using LinkedHashMap.",
          interviewQs: ["How does HashMap handle collisions?","What is the default initial capacity and load factor of HashMap?","What happens if you use a mutable object as a HashMap key?"]
        }
      ]
    },
    "Exception Handling": {
      overview: "Exception handling prevents program crashes by managing errors gracefully. try-catch-finally is the core mechanism. Checked exceptions must be declared or handled. Unchecked exceptions (RuntimeException) are optional. Custom exceptions allow domain-specific error types.",
      subtopics: [
        {
          name: "Try-Catch-Finally",
          explanation: "Code in try block is monitored. If an exception occurs, execution jumps to the matching catch block. finally always runs — even if there's a return or exception in catch. Multiple catch blocks can handle different exception types.",
          beginnerSummary: { en: "try-catch wraps risky code. If something goes wrong, catch handles it. finally always runs — great for cleanup like closing files. Multiple catch blocks handle different exception types.", ml: "try-catch risky code wrap ചെയ്യുന്നു. Problem ഉണ്ടായാൽ catch handle ചെയ്യുന്നു. finally always run ആകുന്നു — file close ചെയ്യാൻ ഉപയോഗിക്കുക." },
          howToStudy: { en: ["Wrap division by zero in try-catch", "Use multiple catch blocks for different exception types", "Test that finally runs even when exception occurs", "Practice try-with-resources for auto-closing"], ml: ["Division by zero try-catch-ൽ wrap ചെയ്യുക", "Multiple catch blocks practice ചെയ്യുക", "Finally always run ആകുന്നു verify ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between checked and unchecked exceptions?", "Can you catch multiple exceptions in one catch block?", "What is the try-with-resources statement?", "What happens if exception is thrown inside finally?"], ml: ["Checked vs unchecked exceptions വ്യത്യാസം?", "try-with-resources statement എന്ത്?"] },
          commonMistakes: { en: ["Catching generic Exception and swallowing it silently (bad practice)", "Returning from inside finally block (overrides method return)", "Not closing resources in finally or try-with-resources"], ml: ["Generic Exception catch ചെയ്ത് silently swallow ചെയ്യൽ bad practice", "Finally-ൽ return ഉപയോഗിക്കൽ"] },
          practiceTips: { en: ["Build a safe calculator catching ArithmeticException and NumberFormatException", "Read a file with try-catch handling FileNotFoundException and IOException separately", "Use try-with-resources to auto-close a Scanner"], ml: ["Safe calculator ArithmeticException catch ചെയ്ത് ഉണ്ടാക്കുക", "File read try-catch ഉപയോഗിച്ച് handle ചെയ്യുക"] },
          beginnerTasks: ["Wrap a division operation in try-catch for ArithmeticException","Open a file in try, handle FileNotFoundException in catch","Use finally to print 'done' regardless of success/failure"],
          practice: ["Build a safe calculator catching division-by-zero and number format errors","Parse an integer from String safely using try-catch","Read a file and handle both FileNotFoundException and IOException"],
          miniChallenge: "Build a file-based student reader that catches all I/O errors, logs them, and returns a default empty list rather than crashing.",
          interviewQs: ["What is the difference between checked and unchecked exceptions?","Can you catch multiple exceptions in one catch block?","What is the try-with-resources statement?"]
        },
        {
          name: "Custom Exceptions",
          explanation: "Custom exceptions extend either Exception (checked) or RuntimeException (unchecked). Add a message and optionally a cause in the constructor. Throw with `throw new CustomException(message)`. Declare with `throws` in method signature for checked types.",
          beginnerSummary: { en: "Custom exceptions make your error messages meaningful for your domain. Extend RuntimeException for unchecked, Exception for checked. Always provide a descriptive message in the constructor.", ml: "Custom exceptions domain-specific error messages meaningful ആക്കുന്നു. Unchecked-ന് RuntimeException extend ചെയ്യുക, checked-ന് Exception extend ചെയ്യുക." },
          howToStudy: { en: ["Create InsufficientFundsException extending RuntimeException", "Throw it in BankAccount.withdraw() with a clear message", "Catch it in the calling code and display user-friendly message", "Practice exception chaining with initCause()"], ml: ["InsufficientFundsException RuntimeException extend ചെയ്ത് create ചെയ്യുക", "BankAccount.withdraw()-ൽ throw ചെയ്യുക"] },
          interviewConcepts: { en: ["When should you create a custom exception?", "What is exception chaining?", "What is the difference between throw and throws?", "When to use checked vs unchecked custom exception?"], ml: ["Custom exception എപ്പോൾ create ചെയ്യണം?", "throw ഉം throws ഉം തമ്മിലുള്ള വ്യത്യാസം?"] },
          commonMistakes: { en: ["Not providing a message in the custom exception constructor", "Catching custom exceptions too broadly and losing information", "Creating too many exceptions — group related ones in a hierarchy"], ml: ["Custom exception constructor-ൽ message provide ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["Build UserRegistrationService throwing InvalidEmailException and WeakPasswordException", "Design OrderService with OrderNotFoundException and InsufficientStockException", "Build auth system: InvalidCredentialsException, AccountLockedException, SessionExpiredException"], ml: ["UserRegistrationService InvalidEmailException, WeakPasswordException throw ചെയ്ത് ഉണ്ടാക്കുക"] },
          beginnerTasks: ["Create InsufficientFundsException extending RuntimeException","Throw it in BankAccount.withdraw() when balance is insufficient","Create InvalidAgeException and throw it for age < 0"],
          practice: ["Build a UserRegistrationService with InvalidEmailException and WeakPasswordException","Design a FileProcessor with FileParseException","Create an OrderService with OrderNotFoundException and InsufficientStockException"],
          miniChallenge: "Build an authentication system with 3 custom exceptions: InvalidCredentialsException, AccountLockedException, SessionExpiredException.",
          interviewQs: ["When should you create a custom exception?","What is exception chaining?","Difference between throw and throws?"]
        }
      ]
    },
    "Multithreading": {
      overview: "Java supports concurrent programming through threads. Multiple threads run simultaneously, sharing memory. Synchronization prevents race conditions. Java provides high-level concurrency utilities in java.util.concurrent for production code.",
      subtopics: [
        {
          name: "Thread Basics",
          explanation: "A thread is a lightweight process. Create threads by extending Thread or implementing Runnable (preferred). Call start() to begin execution — never call run() directly. sleep() pauses the current thread. join() waits for a thread to finish.",
          beginnerSummary: { en: "Threads let your program do multiple things at once. Implement Runnable (preferred) or extend Thread. Always call start() — not run() — to actually launch a new thread.", ml: "Threads program-ന് ഒരേ സമയം multiple things ചെയ്യാൻ allow ചെയ്യുന്നു. Runnable implement ചെയ്യുക (preferred). New thread launch ചെയ്യാൻ start() call ചെയ്യുക, run() അല്ല." },
          howToStudy: { en: ["Create a thread implementing Runnable and print numbers 1-10", "Create two threads printing odd and even numbers alternately", "Use Thread.sleep() to simulate a delay", "Use join() to wait for a thread to complete before continuing"], ml: ["Runnable implement ചെയ്ത് 1-10 print ചെയ്യുക", "Odd ഉം even ഉം threads alternately print ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between Thread and Runnable?", "What does start() do vs run()?", "What is a race condition?", "What is the thread lifecycle (states)?"], ml: ["Thread vs Runnable വ്യത്യാസം?", "start() vs run() വ്യത്യാസം?", "Race condition എന്ത്?"] },
          commonMistakes: { en: ["Calling run() directly instead of start() — runs in same thread, defeats the purpose", "Not handling InterruptedException when using sleep()", "Creating too many threads — use thread pool (ExecutorService) instead"], ml: ["run() directly call ചെയ്യൽ — same thread-ൽ run ആകും", "sleep() interrupt handle ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["Build a race condition demo: two threads increment counter 10,000 times — show wrong result", "Then fix with synchronized keyword", "Use ExecutorService with thread pool of 4 threads for a file processing task"], ml: ["Race condition demo ഉണ്ടാക്കി synchronized ഉപയോഗിച്ച് fix ചെയ്യുക"] },
          beginnerTasks: ["Create a thread by implementing Runnable and print numbers 1-10","Create two threads printing odd and even numbers","Use Thread.sleep() to simulate delays"],
          practice: ["Build a multi-threaded file downloader (simulated)","Create a timer that ticks every second using a background thread","Implement producer-consumer using wait/notify"],
          miniChallenge: "Build a race condition demo: two threads increment a shared counter 10,000 times each. Show the wrong result, then fix with synchronized.",
          interviewQs: ["What is the difference between Thread and Runnable?","What does start() do vs run()?","What is a race condition?"]
        },
        {
          name: "Synchronization",
          explanation: "When multiple threads access shared data, synchronization prevents race conditions. The synchronized keyword makes a method or block atomic. wait() releases the lock and waits, notify() wakes up one waiting thread, notifyAll() wakes all.",
          beginnerSummary: { en: "Synchronization ensures only one thread accesses shared data at a time. Use `synchronized` on methods or blocks. wait/notify enable threads to coordinate — one waits while another does work.", ml: "Synchronization ഒരു time-ൽ ഒരു thread മാത്രം shared data access ചെയ്യുന്നു ensure ചെയ്യുന്നു. `synchronized` methods or blocks-ൽ ഉപയോഗിക്കുക." },
          howToStudy: { en: ["Add synchronized to a counter's increment method", "Demonstrate race condition without sync, then fix it", "Implement producer-consumer using wait() and notify()", "Understand intrinsic lock / monitor concept"], ml: ["Counter increment synchronized ആക്കി race condition fix ചെയ്യുക", "Producer-consumer wait/notify ഉപയോഗിച്ച് implement ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between synchronized method and synchronized block?", "What is a deadlock? How do you avoid it?", "What are volatile variables?", "What is the difference between wait() and sleep()?"], ml: ["Synchronized method vs block വ്യത്യാസം?", "Deadlock എന്ത്? Avoid ചെയ്യുന്നത് എങ്ങനെ?"] },
          commonMistakes: { en: ["Synchronizing on `this` in a static context", "Acquiring locks in different orders in different threads (causes deadlock)", "Using sleep() instead of wait() to pause in synchronized blocks"], ml: ["Different threads-ൽ locks different order-ൽ acquire ചെയ്യൽ deadlock ഉണ്ടാക്കും"] },
          practiceTips: { en: ["Build a thread-safe bank account with synchronized deposit/withdraw", "Implement a bounded blocking queue using wait/notify", "Demonstrate a deadlock with two threads and two locks, then fix the ordering"], ml: ["Thread-safe bank account synchronized deposit/withdraw ഉൾക്കൊള്ളിച്ച് ഉണ്ടാക്കുക"] },
          beginnerTasks: ["Add synchronized to a counter's increment method","Implement producer-consumer using wait() and notify()","Demonstrate a deadlock scenario and explain how to avoid it"],
          practice: ["Build a thread-safe bank account with synchronized deposit/withdraw","Implement a bounded blocking queue using wait/notify","Build a read-write lock simulation"],
          miniChallenge: "Implement a thread-safe LRU cache using HashMap and synchronization that supports concurrent get/put operations.",
          interviewQs: ["What is the difference between synchronized method and synchronized block?","What is a deadlock?","What are volatile variables?"]
        }
      ]
    },
    "Streams API": {
      overview: "Java Streams (Java 8+) provide a functional, declarative way to process collections. A stream pipeline has a source, intermediate operations (filter, map, sorted), and a terminal operation (collect, forEach, reduce). Streams are lazy — they only compute when a terminal operation is called.",
      subtopics: [
        {
          name: "Stream Operations",
          explanation: "filter() keeps elements matching a predicate. map() transforms elements. sorted() orders them. collect(Collectors.toList()) gathers results. reduce() aggregates. flatMap() flattens nested streams. Stream operations are chainable and read like English.",
          beginnerSummary: { en: "Streams let you process collections in a readable, functional style. Chain filter → map → collect to transform data. Streams are lazy — they only process when you call a terminal operation like collect() or forEach().", ml: "Streams collections functional style-ൽ process ചെയ്യാൻ help ചെയ്യുന്നു. filter → map → collect chain ചെയ്ത് data transform ചെയ്യുക. Terminal operation call ചെയ്യുമ്പോൾ മാത്രം process ആകുന്നു." },
          howToStudy: { en: ["Filter a list of numbers to keep only evens", "Map a list of strings to uppercase", "Chain filter + map + collect in one pipeline", "Use reduce() to sum a list of numbers"], ml: ["Numbers filter ചെയ്ത് evens മാത്രം keep ചെയ്യുക", "Strings uppercase-ലേക്ക് map ചെയ്യുക", "filter + map + collect chain practice ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between map() and flatMap()?", "Are Java Streams reusable?", "What is the difference between findFirst() and findAny()?", "What is a terminal vs intermediate operation?"], ml: ["map() vs flatMap() വ്യത്യാസം?", "Streams reusable ആണോ?"] },
          commonMistakes: { en: ["Reusing a stream after it has been consumed (throws IllegalStateException)", "Using streams for simple iterations where a for loop is clearer", "Forgetting that stream operations are lazy — intermediate ops don't run without terminal op"], ml: ["Consumed stream reuse ചെയ്യൽ IllegalStateException ഉണ്ടാക്കും", "Stream operations lazy ആണ് — terminal op ഇല്ലാതെ run ആകില്ല"] },
          practiceTips: { en: ["Find top 3 highest-paid employees from a list using sorted + limit", "Get distinct department names using .map().distinct().collect()", "Sum all transactions over 1000 using filter + mapToDouble + sum()"], ml: ["Top 3 highest-paid employees sorted + limit ഉപയോഗിച്ച് find ചെയ്യുക"] },
          beginnerTasks: ["Filter a list of numbers to keep only even numbers","Map a list of strings to uppercase","Collect filtered and mapped results into a new List"],
          practice: ["Find the top 3 highest-paid employees from a list","Get distinct department names from an employee list","Sum all transaction amounts greater than 1000"],
          miniChallenge: "Given a list of Student objects, find the average GPA of CSE students with marks above 75, sorted by name.",
          interviewQs: ["What is the difference between map() and flatMap()?","Are Java Streams reusable?","What is the difference between findFirst() and findAny()?"]
        }
      ]
    }
  },

  dsa: {
    "Arrays": {
      overview: "Arrays are contiguous blocks of memory. Direct index access is O(1). Insertion/deletion at arbitrary positions is O(n). Two-pointer, sliding window, and prefix sum are the most tested array techniques in placement interviews.",
      subtopics: [
        {
          name: "Two Pointer Technique",
          explanation: "Two pointers — one at each end (or both moving in same direction) — reduce O(n²) solutions to O(n). Use for finding pairs with a target sum, removing duplicates, or checking palindromes on sorted/partitioned data.",
          beginnerSummary: { en: "Two pointers eliminates nested loops by using two indices moving toward each other. It turns O(n²) problems into O(n). Works best on sorted arrays.", ml: "Two pointers nested loops eliminate ചെയ്ത് O(n²) problems O(n)-ൽ solve ചെയ്യുന്നു. Sorted arrays-ൽ best ആണ്." },
          howToStudy: { en: ["Solve 'pair with target sum' in sorted array", "Remove duplicates in sorted array in-place", "Check if a string is a palindrome using two pointers", "Then try 3Sum using two pointers inside a loop"], ml: ["Sorted array-ൽ target sum pair find ചെയ്യുക", "Palindrome check two pointers ഉപയോഗിച്ച് ചെയ്യുക"] },
          interviewConcepts: { en: ["When should you use two pointers?", "How does two-pointer handle duplicates in 3Sum?", "What is the time complexity of two-pointer vs nested loops?", "How is two-pointer different from sliding window?"], ml: ["Two pointers എപ്പോൾ ഉപയോഗിക്കണം?", "3Sum-ൽ duplicates handle ചെയ്യുന്നത് എങ്ങനെ?"] },
          commonMistakes: { en: ["Applying two pointers to unsorted arrays where it doesn't work", "Not handling duplicates in 3Sum (leads to duplicate triplets in output)", "Moving the wrong pointer in the wrong direction"], ml: ["Unsorted arrays-ൽ two pointers apply ചെയ്യൽ work ആകില്ല", "3Sum-ൽ duplicates handle ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["Solve LeetCode: Two Sum II (sorted), 3Sum, Container With Most Water", "Practice removing duplicates from sorted array in-place", "Try trapping rain water — classic two-pointer problem"], ml: ["Two Sum II, 3Sum, Container With Most Water practice ചെയ്യുക"] },
          beginnerTasks: ["Find pair with target sum in sorted array","Remove duplicates from sorted array in-place","Check if a string is a palindrome using two pointers"],
          practice: ["3Sum — find all triplets that sum to zero","Container with most water","Trapping rain water"],
          miniChallenge: "Find two indices such that nums[i] + nums[j] = target. Return all unique pairs. Optimize to O(n).",
          interviewQs: ["When should you use two pointers?","How does two-pointer handle duplicates in 3Sum?","What is the time complexity of two-pointer vs nested loops?"]
        },
        {
          name: "Sliding Window",
          explanation: "A fixed or variable-size window slides over the array. Expand right to explore, shrink left to satisfy constraints. Used for maximum/minimum subarray of size k, longest substring with condition, and minimum window problems.",
          beginnerSummary: { en: "Sliding window avoids recomputing by moving a window across the array, only adding the new element and removing the old. Fixed-size window for max/min of k elements; variable-size for condition-based problems.", ml: "Sliding window window array-ൽ move ചെയ്ത് recomputation avoid ചെയ്യുന്നു. Fixed window max/min k elements-ന്, variable window condition-based problems-ന്." },
          howToStudy: { en: ["Solve maximum sum subarray of fixed size k", "Then solve longest subarray with at most k distinct elements (variable window)", "Track window state using a HashMap", "Practice shrinking the window from the left until constraint is satisfied"], ml: ["Fixed size k-ൽ maximum sum subarray solve ചെയ്യുക", "Variable window practice ചെയ്യുക"] },
          interviewConcepts: { en: ["When do you use a fixed vs variable sliding window?", "What data structures help track window state?", "How is sliding window different from two pointers?", "What is the time complexity of sliding window?"], ml: ["Fixed vs variable sliding window എപ്പോൾ?", "Window state track ചെയ്യാൻ ഏത് data structures?"] },
          commonMistakes: { en: ["Applying sliding window to non-contiguous subarray problems", "Forgetting to shrink the window when constraint is violated", "Off-by-one errors in window boundaries"], ml: ["Window constraint violate ആകുമ്പോൾ shrink ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["LeetCode: Longest Substring Without Repeating Characters, Minimum Window Substring", "Practice maximum of all subarrays of size k using a deque", "Solve 'longest subarray with sum ≤ k'"], ml: ["Longest Substring Without Repeating Characters practice ചെയ്യുക"] },
          beginnerTasks: ["Find maximum sum subarray of size k","Find longest subarray with at most k distinct elements","Count subarrays with sum equal to target"],
          practice: ["Minimum window substring","Longest substring without repeating characters","Maximum of all subarrays of size k"],
          miniChallenge: "Given a string s and pattern p, find the smallest window in s that contains all characters of p.",
          interviewQs: ["When do you use a fixed vs variable sliding window?","What data structures help track window state?","How is sliding window different from two pointers?"]
        },
        {
          name: "Prefix Sum",
          explanation: "Prefix sum precomputes cumulative sums so any range sum query answers in O(1). Build the prefix array once in O(n), then sum(l,r) = prefix[r] - prefix[l-1]. Useful for range queries, equilibrium index, and subarray sum equals k.",
          beginnerSummary: { en: "Prefix sum precomputes cumulative sums to answer range queries in O(1). Instead of summing each time, subtract two prefix values. Essential for range sum problems.", ml: "Prefix sum cumulative sums precompute ചെയ്ത് range queries O(1)-ൽ answer ചെയ്യുന്നു. Range sum-ന് two prefix values subtract ചെയ്യുക." },
          howToStudy: { en: ["Build prefix sum array from a given array", "Answer 5 range sum queries using prefix array", "Solve 'equilibrium index' using prefix sum", "Combine with HashMap for 'subarray sum equals k'"], ml: ["Prefix sum array build ചെയ്ത് range sum queries answer ചെയ്യുക", "Equilibrium index prefix sum ഉപയോഗിച്ച് solve ചെയ്യുക"] },
          interviewConcepts: { en: ["How does prefix sum enable O(1) range queries?", "What is the space complexity of prefix sum?", "How do you handle 2D prefix sums?", "How to use prefix sum + HashMap for subarray sum = k?"], ml: ["Prefix sum O(1) range queries enable ചെയ്യുന്നത് എങ്ങനെ?", "2D prefix sums handle ചെയ്യുന്നത് എങ്ങനെ?"] },
          commonMistakes: { en: ["Off-by-one error in prefix sum formula (prefix[r] - prefix[l-1] vs prefix[l])", "Building 0-indexed prefix sum but using 1-indexed formula", "Not initializing prefix[0] = 0 for the 1-indexed approach"], ml: ["Prefix sum formula-ൽ off-by-one error", "0-indexed vs 1-indexed prefix sum confuse ആകൽ"] },
          practiceTips: { en: ["Solve 'subarray sum equals k' using HashMap + prefix sum (O(n))", "Find product of array except self (no division)", "Build 2D prefix sum and answer rectangle sum queries"], ml: ["Subarray sum equals k HashMap + prefix sum O(n)-ൽ solve ചെയ്യുക"] },
          beginnerTasks: ["Build prefix sum array and answer 5 range queries","Find equilibrium index of an array","Count subarrays with even sum"],
          practice: ["Subarray sum equals k (HashMap + prefix sum)","Find pivot index","Product of array except self"],
          miniChallenge: "Given a 2D matrix, build a 2D prefix sum and answer range rectangle sum queries in O(1).",
          interviewQs: ["How does prefix sum enable O(1) range queries?","What is the space complexity of prefix sum?","How do you handle 2D prefix sums?"]
        }
      ]
    },
    "Linked Lists": {
      overview: "Linked lists are dynamic data structures of nodes. Each node holds data and a pointer to the next node. No random access — traversal is O(n). However, insertion/deletion at known positions is O(1). Floyd's cycle algorithm and reversal are essential interview patterns.",
      subtopics: [
        {
          name: "Reversal",
          explanation: "Iterative reversal uses three pointers: prev, curr, next. prev starts null, curr starts head. Each step: save next, point curr.next to prev, advance both. The new head is prev when curr is null. Recursive reversal is clean but uses O(n) stack space.",
          beginnerSummary: { en: "Reverse a linked list by redirecting each node's next pointer to the previous node. Iterative approach uses 3 pointers: prev, curr, next. Recursive is elegant but uses O(n) stack space.", ml: "Linked list reverse ചെയ്യാൻ ഓരോ node-ന്റെ next pointer previous node-ലേക്ക് redirect ചെയ്യുക. Iterative 3 pointers ഉപയോഗിക്കുന്നു. Recursive stack space O(n) ഉപയോഗിക്കുന്നു." },
          howToStudy: { en: ["Trace through iterative reversal on paper with 5 nodes", "Implement iteratively with prev/curr/next", "Implement recursively and understand the call stack", "Reverse in groups of k — harder variant"], ml: ["5 nodes-ൽ iterative reversal paper-ൽ trace ചെയ്യുക", "prev/curr/next ഉപയോഗിച്ച് implement ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the time and space complexity of iterative reversal?", "How do you reverse a doubly linked list?", "What edge cases must you handle in linked list reversal?", "How do you reverse only a portion of a linked list?"], ml: ["Iterative reversal time, space complexity?", "Edge cases: empty list, single node handle ചെയ്യൽ?"] },
          commonMistakes: { en: ["Not saving next before overwriting curr.next (loses rest of list)", "Not handling edge cases: empty list and single-node list", "Returning curr instead of prev as the new head"], ml: ["curr.next overwrite ചെയ്യുന്നതിന് മുൻപ് next save ചെയ്യാൻ forget ആകൽ", "New head prev ആണ്, curr അല്ല"] },
          practiceTips: { en: ["LeetCode: Reverse Linked List, Palindrome Linked List, Reverse Nodes in k-Group", "Reverse the second half to check palindrome in O(n) O(1) space", "Practice until you can code reversal from memory"], ml: ["Reverse Linked List, Palindrome Linked List practice ചെയ്യുക"] },
          beginnerTasks: ["Reverse a singly linked list iteratively","Reverse a singly linked list recursively","Reverse a linked list in groups of k"],
          practice: ["Reverse nodes in k-group","Palindrome linked list (reverse second half)","Swap nodes in pairs"],
          miniChallenge: "Reverse the second half of a linked list and check if the full list is a palindrome in O(n) time and O(1) space.",
          interviewQs: ["What is the time and space complexity of iterative reversal?","How do you reverse a doubly linked list?","What edge cases must you handle?"]
        },
        {
          name: "Cycle Detection",
          explanation: "Floyd's tortoise and hare algorithm detects cycles with two pointers moving at different speeds. If they meet, there's a cycle. To find the start: reset one pointer to head, advance both one step — they meet at the cycle start.",
          beginnerSummary: { en: "Floyd's algorithm uses slow (1 step) and fast (2 steps) pointers. If they meet, there's a cycle. To find the cycle start, reset slow to head and advance both one step at a time — they meet at the entry point.", ml: "Floyd's algorithm slow (1 step) ഉം fast (2 steps) pointers ഉപയോഗിക്കുന്നു. Meet ആകുന്നുണ്ടെങ്കിൽ cycle ഉണ്ട്. Cycle start find ചെയ്യാൻ slow head-ലേക്ക് reset ചെയ്ത് both 1 step advance ചെയ്യുക." },
          howToStudy: { en: ["Implement cycle detection with slow/fast pointers", "Prove to yourself why they meet inside the cycle", "Implement cycle start detection (reset slow to head)", "Count cycle length after detection"], ml: ["Slow/fast pointers ഉപയോഗിച്ച് cycle detect ചെയ്യുക", "Cycle start detection implement ചെയ്യുക"] },
          interviewConcepts: { en: ["How does Floyd's algorithm work?", "What is the time complexity of cycle detection?", "Why does Floyd's algorithm work mathematically?", "How do you find the duplicate number using cycle detection?"], ml: ["Floyd's algorithm എങ്ങനെ work ചെയ്യുന്നു?", "Time complexity?"] },
          commonMistakes: { en: ["Not checking fast.next != null before fast.next.next (NullPointerException)", "Confusing cycle detection with cycle entry finding", "Forgetting to re-initialize one pointer to head for finding cycle start"], ml: ["fast.next null check ഇല്ലാതെ fast.next.next access ചെയ്യൽ NPE ഉണ്ടാക്കും"] },
          practiceTips: { en: ["LeetCode: Linked List Cycle, Linked List Cycle II, Find Duplicate Number", "Prove mathematically why slow meets fast at exactly cycle_length - dist_from_head steps", "Apply Floyd's to Happy Number problem"], ml: ["Linked List Cycle, Cycle II, Find Duplicate Number practice ചെയ്യുക"] },
          beginnerTasks: ["Detect if a linked list has a cycle","Find the start of a cycle using Floyd's algorithm","Count the length of the cycle"],
          practice: ["Find duplicate number (cycle in implicit linked list)","Happy number (cycle detection with math)","Linked list cycle II — return cycle start"],
          miniChallenge: "Given a linked list, find and remove the cycle without using any extra data structures.",
          interviewQs: ["How does Floyd's algorithm work?","What is the time complexity of cycle detection?","Why does Floyd's algorithm work mathematically?"]
        }
      ]
    },
    "Trees": {
      overview: "Trees are hierarchical data structures. Binary trees have at most 2 children. Binary Search Trees maintain order. Tree traversals (inorder, preorder, postorder, level-order) and recursion are the foundation. Most tree problems are solved elegantly with recursion.",
      subtopics: [
        {
          name: "Tree Traversals",
          explanation: "Inorder (Left-Root-Right) visits BST nodes in sorted order. Preorder (Root-Left-Right) used for serialization. Postorder (Left-Right-Root) used for deletion. Level-order (BFS with queue) processes nodes level by level.",
          beginnerSummary: { en: "Tree traversals define the order you visit nodes. Inorder gives sorted output for BST. Preorder is for copying/serializing. Postorder is for deletion. Level-order uses a queue for breadth-first visit.", ml: "Tree traversals nodes visit ചെയ്യുന്ന order define ചെയ്യുന്നു. Inorder BST-ൽ sorted output നൽകുന്നു. Level-order queue ഉപയോഗിക്കുന്നു." },
          howToStudy: { en: ["Implement recursive inorder, preorder, postorder", "Then implement iterative inorder using a stack", "Implement level-order using a queue", "Practice zigzag level-order as a harder variant"], ml: ["Recursive inorder, preorder, postorder implement ചെയ്യുക", "Iterative inorder stack ഉപയോഗിച്ച് implement ചെയ്യുക"] },
          interviewConcepts: { en: ["What traversal visits a BST in sorted order?", "How do you do iterative postorder traversal?", "How do you find the height of a binary tree?", "What is the Morris traversal?"], ml: ["BST sorted order traversal ഏത്?", "Iterative postorder traversal?"] },
          commonMistakes: { en: ["Confusing inorder (L-R-Root) with postorder — inorder is L-Root-R", "Not using a queue for level-order (common mistake to use stack)", "Forgetting to handle null nodes in recursive traversal"], ml: ["Inorder ഉം postorder ഉം confuse ആകൽ", "Level-order-ന് stack ഉപയോഗിക്കൽ — queue ഉപയോഗിക്കണം"] },
          practiceTips: { en: ["LeetCode: Binary Tree Inorder Traversal, Level Order Traversal, Zigzag Level Order", "Draw a tree on paper and trace each traversal manually", "Implement all 4 traversals from memory — standard interview requirement"], ml: ["4 traversals paper-ൽ trace ചെയ്ത് practice ചെയ്യുക"] },
          beginnerTasks: ["Implement recursive inorder, preorder, postorder","Implement iterative inorder using a stack","Implement level-order traversal using a queue"],
          practice: ["Maximum depth of binary tree","Symmetric tree check","Binary tree level order traversal (return as 2D list)"],
          miniChallenge: "Print a binary tree in zigzag level order (alternating left-to-right and right-to-left).",
          interviewQs: ["What traversal visits a BST in sorted order?","How do you do iterative postorder traversal?","How do you find the height of a binary tree?"]
        },
        {
          name: "Binary Search Tree",
          explanation: "In a BST, left subtree has values less than root, right has values greater. This gives O(log n) search, insert, delete for balanced trees. Inorder traversal of a BST yields a sorted sequence. Balance is key — a degenerate BST becomes O(n).",
          beginnerSummary: { en: "A BST keeps data ordered: left < root < right. This gives O(log n) operations on balanced trees. Inorder traversal gives sorted output. An unbalanced BST degenerates to O(n) — like a linked list.", ml: "BST data ordered ആയി keep ചെയ്യുന്നു: left < root < right. Balanced tree-ൽ O(log n) operations. Inorder sorted output നൽകുന്നു." },
          howToStudy: { en: ["Insert elements and draw the resulting BST", "Implement search, insert, delete", "Validate a BST without inorder traversal (use range checking)", "Convert sorted array to balanced BST"], ml: ["Elements insert ചെയ്ത് BST draw ചെയ്യുക", "Search, insert, delete implement ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the worst case time complexity of BST operations?", "How do you validate a BST without inorder traversal?", "What is the difference between BST and AVL tree?", "How do you find the kth smallest element in a BST?"], ml: ["BST worst case time complexity?", "BST vs AVL tree വ്യത്യാസം?"] },
          commonMistakes: { en: ["Validating BST by only checking local parent-child relationship (fails for subtrees)", "Deleting a node by just removing it without handling children", "Forgetting that BST operations are O(n) worst case for unbalanced trees"], ml: ["BST validate ചെയ്യുമ്പോൾ local check மட்டும் ചെയ്യൽ fails", "Node delete ചെയ്യുമ്പോൾ children handle ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["LeetCode: Validate BST, Kth Smallest in BST, Delete Node in BST", "Build BST from sorted array (always height-balanced)", "Practice finding LCA (Lowest Common Ancestor) in BST"], ml: ["Validate BST, Kth Smallest in BST practice ചെയ്യുക"] },
          beginnerTasks: ["Insert elements into a BST and visualize","Search for a value in a BST","Find minimum and maximum in a BST"],
          practice: ["Validate binary search tree","Kth smallest element in BST","Delete a node from BST"],
          miniChallenge: "Given a sorted array, build a height-balanced BST from it.",
          interviewQs: ["What is the worst case time complexity of BST operations?","How do you validate a BST without inorder traversal?","What is the difference between BST and AVL tree?"]
        }
      ]
    },
    "Graphs": {
      overview: "Graphs model relationships between entities. Vertices connected by edges. Directed or undirected, weighted or unweighted. BFS finds shortest paths in unweighted graphs. DFS explores deep paths. Union-Find manages connected components efficiently.",
      subtopics: [
        {
          name: "BFS and DFS",
          explanation: "BFS uses a queue and explores level by level — great for shortest paths and level-order processing. DFS uses a stack (or recursion) and explores as far as possible — great for cycle detection, topological sort, and path exploration.",
          beginnerSummary: { en: "BFS explores level by level using a queue — finds shortest paths in unweighted graphs. DFS dives deep using a stack/recursion — good for cycle detection and path existence. Both run in O(V+E).", ml: "BFS queue ഉപയോഗിച്ച് level by level explore ചെയ്യുന്നു — shortest paths find ചെയ്യാൻ. DFS recursion/stack ഉപയോഗിക്കുന്നു — cycle detection-ന്. Both O(V+E)." },
          howToStudy: { en: ["Implement BFS on an adjacency list graph", "Implement DFS iteratively and recursively", "Solve 'number of islands' with BFS and DFS", "Apply multi-source BFS for 'rotting oranges'"], ml: ["Adjacency list graph-ൽ BFS implement ചെയ്യുക", "DFS iterative ഉം recursive ഉം implement ചെയ്യുക"] },
          interviewConcepts: { en: ["When do you use BFS vs DFS?", "How do you detect a cycle in an undirected graph using BFS?", "What is the time complexity of BFS and DFS?", "What is topological sort and when do you use it?"], ml: ["BFS vs DFS എപ്പോൾ?", "Undirected graph cycle detection?"] },
          commonMistakes: { en: ["Not marking nodes as visited before adding to queue (causes infinite loop)", "Using BFS for problems that require DFS (path existence, backtracking)", "Not handling disconnected graphs — need to loop over all nodes"], ml: ["Queue-ൽ add ചെയ്യുന്നതിന് മുൻപ് visited mark ചെയ്യാൻ forget ആകൽ", "Disconnected graphs handle ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["LeetCode: Number of Islands, Rotting Oranges, Word Ladder, Course Schedule", "Practice on both adjacency matrix and adjacency list representations", "Implement topological sort using BFS (Kahn's algorithm) and DFS"], ml: ["Number of Islands, Rotting Oranges, Word Ladder practice ചെയ്യുക"] },
          beginnerTasks: ["Implement BFS on an adjacency list graph","Implement DFS iteratively and recursively","Find all connected components using DFS"],
          practice: ["Number of islands (BFS/DFS on grid)","Rotting oranges (multi-source BFS)","Word ladder (BFS with level counting)"],
          miniChallenge: "Given a maze as a 2D grid, find the shortest path from start to end using BFS.",
          interviewQs: ["When do you use BFS vs DFS?","How do you detect a cycle in an undirected graph?","What is the time complexity of BFS and DFS?"]
        }
      ]
    }
  },

  cyber: {
    "Linux": {
      overview: "Linux is the operating system of cybersecurity. Every tool, server, and cloud instance runs Linux. Understanding the file system, permissions, process management, and shell scripting is essential for both development and security roles.",
      subtopics: [
        {
          name: "File System and Navigation",
          explanation: "The Linux file system follows a tree structure rooted at /. Key directories: /etc (configuration), /var (logs), /home (user data), /bin (binaries), /tmp (temporary files). Use ls, cd, pwd, find, locate to navigate.",
          beginnerSummary: { en: "Linux file system is a tree rooted at /. Key directories: /etc for config, /var for logs, /home for users, /bin for binaries. Learn ls, cd, pwd, find, grep to navigate confidently.", ml: "Linux file system / root-ൽ tree ആണ്. /etc config-ന്, /var logs-ന്, /home users-ന്, /bin binaries-ന്. ls, cd, pwd, find, grep confidently ഉപയോഗിക്കുക." },
          howToStudy: { en: ["Memorize key directories and their purpose", "Practice navigating with cd, ls -la, pwd", "Use find to search files by name, type, size, age", "Use grep -r to search file contents recursively"], ml: ["Key directories ഉം purpose ഉം memorize ചെയ്യുക", "cd, ls -la, pwd practice ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between /etc/passwd and /etc/shadow?", "How do you find which process is using a file?", "What is the significance of inode numbers?", "What is the difference between hard link and soft link?"], ml: ["/etc/passwd vs /etc/shadow വ്യത്യാസം?", "Hard link vs soft link?"] },
          commonMistakes: { en: ["Running commands as root unnecessarily (security risk)", "Using rm -rf without double-checking the path", "Not understanding relative vs absolute paths"], ml: ["Unnecessarily root ആയി commands run ചെയ്യൽ security risk", "rm -rf path double-check ചെയ്യാതെ run ചെയ്യൽ"] },
          practiceTips: { en: ["Write a bash script finding all files > 1MB in /var/log", "Search for all .conf files under /etc using find -name", "Use grep -r to find 'error' in all log files"], ml: ["1MB-ൽ കൂടുതലുള്ള files find ചെയ്യുന്ന bash script എഴുതുക"] },
          beginnerTasks: ["Navigate to /etc and list all files","Find all .conf files under /etc using find","Use `ls -la` to show hidden files and permissions"],
          practice: ["Find all files modified in the last 24 hours","Search file contents with grep -r 'error' /var/log","Combine find and grep to search inside files recursively"],
          miniChallenge: "Write a bash script that finds all files larger than 1MB in /var/log and outputs their names and sizes.",
          interviewQs: ["What is the difference between /etc/passwd and /etc/shadow?","How do you find which process is using a file?","What is the significance of inode numbers?"]
        },
        {
          name: "Permissions",
          explanation: "Linux permissions use rwx (read, write, execute) for owner, group, and others. chmod changes permissions. chown changes ownership. SUID/SGID are special permission bits that can be exploited. Misconfigured permissions are a common attack vector.",
          beginnerSummary: { en: "Linux permissions control who can read, write, execute files. chmod sets permissions numerically (755) or symbolically. SUID binaries run as the file owner — a major privilege escalation vector if misconfigured.", ml: "Linux permissions read, write, execute control ചെയ്യുന്നു. chmod numerically (755) or symbolically set ചെയ്യുക. SUID binaries file owner ആയി run ആകുന്നു — misconfigured ആകുകയാണെങ്കിൽ privilege escalation ഉണ്ടാകും." },
          howToStudy: { en: ["Read `ls -l` output and decode rwxrwxrwx format", "Use chmod with octal (chmod 644) and symbolic (chmod u+x)", "Use chown to change file owner and group", "Find all SUID binaries with find / -perm -4000"], ml: ["ls -l output read ചെയ്ത് permissions decode ചെയ്യുക", "chmod octal ഉം symbolic ഉം practice ചെയ്യുക"] },
          interviewConcepts: { en: ["What is SUID and why is it a security risk?", "What does chmod 777 mean?", "How do you prevent privilege escalation via cron?", "What is umask?"], ml: ["SUID security risk ആണ് എന്തുകൊണ്ട്?", "chmod 777 mean?", "umask?"] },
          commonMistakes: { en: ["Setting chmod 777 on sensitive files or directories", "Not auditing SUID/SGID binaries regularly", "Confusing user (u), group (g), other (o) in symbolic chmod"], ml: ["Sensitive files-ൽ chmod 777 set ചെയ്യൽ", "SUID/SGID binaries audit ചെയ്യാൻ forget ആകൽ"] },
          practiceTips: { en: ["Write an audit script reporting world-writable files in a directory", "Find all SUID binaries and research if any are exploitable", "Practice GTFOBins — catalogue of exploitable SUID binaries"], ml: ["World-writable files report ചെയ്യുന്ന audit script ഉണ്ടാക്കുക", "GTFOBins practice ചെയ്യുക"] },
          beginnerTasks: ["Use `ls -l` to read permissions on 5 files","Change a file's permissions to 644 and 755 with chmod","Use chown to change file ownership"],
          practice: ["Find all SUID binaries on the system with find / -perm -4000","Write a script that makes a file executable only for the owner","Demonstrate privilege escalation via a misconfigured SUID binary"],
          miniChallenge: "Write a bash script that audits a directory and reports files that are world-writable (security risk).",
          interviewQs: ["What is SUID and why is it a security risk?","What does chmod 777 mean?","How do you prevent privilege escalation via cron?"]
        }
      ]
    },
    "Networking": {
      overview: "Networking knowledge is foundational for both development and security. Protocols define how systems communicate. Understanding TCP/IP, DNS, HTTP, and packet structure helps you analyze traffic, find vulnerabilities, and design secure systems.",
      subtopics: [
        {
          name: "OSI and TCP/IP Models",
          explanation: "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. TCP/IP has 4: Network Access, Internet, Transport, Application. Each layer adds a header. This layered model helps isolate and debug network issues.",
          beginnerSummary: { en: "OSI has 7 layers; TCP/IP has 4. Each layer wraps data with its own header (encapsulation). Understanding layers helps you know where attacks happen and which tools work at which level.", ml: "OSI 7 layers; TCP/IP 4 layers. ഓരോ layer-ഉം data-ന് header add ചെയ്യുന്നു (encapsulation). Attacks ഏത് layer-ൽ ഉണ്ടാകുന്നു എന്ന് മനസ്സിലാക്കാൻ help ചെയ്യുന്നു." },
          howToStudy: { en: ["Memorize OSI layers with a mnemonic (Please Do Not Throw Sausage Pizza Away)", "Map common protocols to their layer", "Explain what encapsulation/decapsulation means at each layer", "Identify which layer each attack targets (ARP spoofing = L2, IP spoofing = L3)"], ml: ["OSI layers mnemonic ഉപയോഗിച്ച് memorize ചെയ്യുക", "Common protocols ഏത് layer-ൽ ആണ് map ചെയ്യുക"] },
          interviewConcepts: { en: ["Which layer does a router operate at?", "What happens at the Transport layer?", "What is encapsulation in networking?", "Which layer does a switch operate at vs a router?"], ml: ["Router ഏത് layer-ൽ operate ചെയ്യുന്നു?", "Transport layer-ൽ ഏത് happen ചെയ്യുന്നു?"] },
          commonMistakes: { en: ["Confusing layer 4 (Transport) with layer 5 (Session)", "Thinking switches work at Layer 3 — they work at Layer 2", "Not knowing PDU names: bits (L1), frames (L2), packets (L3), segments (L4)"], ml: ["Switch Layer 3-ൽ ആണ് Layer 2-ൽ ആണ് confuse ആകൽ", "PDU names L1-L4 remember ചെയ്യൽ"] },
          practiceTips: { en: ["Capture HTTP traffic in Wireshark and identify OSI layers in packet details", "Trace a web request from browser to server across all layers", "Label each field in a Wireshark packet with its OSI layer"], ml: ["Wireshark-ൽ HTTP traffic capture ചെയ്ത് OSI layers identify ചെയ്യുക"] },
          beginnerTasks: ["List all 7 OSI layers with a real-world example for each","Map TCP, UDP, HTTP to their OSI layers","Draw the TCP/IP model and map OSI layers to it"],
          practice: ["Trace a web request from browser to server across all layers","Identify which layer each attack targets","Capture traffic in Wireshark and identify OSI layers"],
          miniChallenge: "Explain what happens at each OSI layer when you type www.google.com and press Enter.",
          interviewQs: ["Which layer does a router operate at?","What happens at the Transport layer?","What is encapsulation in networking?"]
        },
        {
          name: "Protocols",
          explanation: "HTTP (port 80) transfers web content. HTTPS (port 443) is encrypted with TLS. DNS (port 53) resolves domain names to IPs. SSH (port 22) provides encrypted remote access. SMTP (port 25/587) sends email. Knowing protocols and their ports is essential for security.",
          beginnerSummary: { en: "Key protocols and ports: HTTP:80, HTTPS:443, DNS:53, SSH:22, FTP:21, SMTP:25, RDP:3389. Knowing these is essential for network analysis, firewall rules, and security assessments.", ml: "Key protocols: HTTP:80, HTTPS:443, DNS:53, SSH:22, FTP:21, SMTP:25, RDP:3389. Network analysis, firewall rules, security assessments-ന് essential ആണ്." },
          howToStudy: { en: ["Memorize top 15 ports and their protocols", "Explain the HTTP request/response cycle in detail", "Describe the TLS handshake step by step", "Practice using curl to make HTTP requests"], ml: ["Top 15 ports ഉം protocols ഉം memorize ചെയ്യുക", "HTTP request/response cycle explain ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between TCP and UDP?", "How does HTTPS protect against MITM attacks?", "What is a DNS cache poisoning attack?", "What is the TLS handshake?"], ml: ["TCP vs UDP?", "HTTPS MITM attacks-ൽ നിന്ന് protect ചെയ്യുന്നത് എങ്ങനെ?"] },
          commonMistakes: { en: ["Confusing port 25 (SMTP) with port 110 (POP3) and 143 (IMAP)", "Thinking HTTPS encrypts the URL — the domain is visible, only the path is encrypted", "Not knowing that DNS uses both UDP and TCP (UDP for queries, TCP for zone transfers)"], ml: ["SMTP, POP3, IMAP ports confuse ആകൽ", "HTTPS domain visible ആണ്, path encrypted ആണ്"] },
          practiceTips: { en: ["Use curl to make HTTP GET and POST requests and inspect headers", "Capture HTTP and HTTPS traffic in Wireshark — compare what's visible", "Use nslookup and dig to query DNS records"], ml: ["curl HTTP GET, POST requests ഉണ്ടാക്കി headers inspect ചെയ്യുക", "Wireshark HTTP vs HTTPS traffic compare ചെയ്യുക"] },
          beginnerTasks: ["List 15 common ports and their protocols","Explain the HTTP request/response cycle","Describe the TLS handshake process"],
          practice: ["Use curl to make HTTP GET and POST requests","Use nslookup to query DNS records","Capture HTTP traffic in Wireshark and read request headers"],
          miniChallenge: "Intercept and modify an HTTP request using Burp Suite — change a parameter value and observe the server response.",
          interviewQs: ["What is the difference between TCP and UDP?","How does HTTPS protect against MITM attacks?","What is a DNS cache poisoning attack?"]
        }
      ]
    },
    "OWASP Top 10": {
      overview: "OWASP Top 10 is the standard awareness document for web application security. It represents the most critical security risks. Every web developer and security professional must know these vulnerabilities and how to prevent them.",
      subtopics: [
        {
          name: "SQL Injection",
          explanation: "SQL injection occurs when user input is directly embedded in SQL queries without sanitization. An attacker can manipulate the query to bypass authentication, extract, modify, or delete data. Prevention: use PreparedStatements or parameterized queries.",
          beginnerSummary: { en: "SQL injection tricks the database by inserting malicious SQL into input fields. Classic payload: ' OR 1=1 --. Prevention: always use PreparedStatements — never concatenate user input into queries.", ml: "SQL injection malicious SQL input fields-ൽ insert ചെയ്ത് database trick ചെയ്യുന്നു. Prevention: PreparedStatements ഉപയോഗിക്കുക — user input directly query-ൽ concatenate ചെയ്യരുത്." },
          howToStudy: { en: ["Understand why ' OR 1=1 -- bypasses login", "Practice UNION-based SQLi to extract table names", "Learn blind SQLi using time delays (SLEEP)", "Write PreparedStatement code and verify it prevents injection"], ml: ["' OR 1=1 -- login bypass ചെയ്യുന്നത് എന്തുകൊണ്ട് understand ചെയ്യുക", "PreparedStatement code practice ചെയ്യുക"] },
          interviewConcepts: { en: ["How does PreparedStatement prevent SQL injection?", "What is the difference between UNION-based and blind SQLi?", "What are stored procedures and do they prevent SQLi?", "What is second-order SQL injection?"], ml: ["PreparedStatement SQL injection prevent ചെയ്യുന്നത് എങ്ങനെ?", "UNION-based vs blind SQLi?"] },
          commonMistakes: { en: ["Using stored procedures and thinking they're automatically safe (they can still be vulnerable)", "Only sanitizing on client-side (easily bypassed)", "Not using parameterized queries for every database interaction"], ml: ["Client-side sanitization only ചെയ്യൽ — easily bypass ചെയ്യാം", "Stored procedures automatically safe ആണ് എന്ന് assume ചെയ്യൽ"] },
          practiceTips: { en: ["Practice on DVWA (Damn Vulnerable Web Application) SQL injection module", "Use sqlmap on a test target to understand automated exploitation", "Build vulnerable login form, exploit it, then fix with PreparedStatements"], ml: ["DVWA SQL injection module practice ചെയ്യുക", "sqlmap test target-ൽ practice ചെയ്യുക"] },
          beginnerTasks: ["Demonstrate a simple login bypass with ' OR 1=1 --","Use sqlmap on a test target to extract database schema","Write a PreparedStatement that prevents SQL injection"],
          practice: ["Exploit UNION-based SQLi to extract table names","Practice blind SQLi using time delays (SLEEP)","Write unit tests to verify SQL injection prevention in your Java code"],
          miniChallenge: "Build a vulnerable login form, demonstrate injection, then fix it with PreparedStatements. Document both the vulnerability and the fix.",
          interviewQs: ["How does PreparedStatement prevent SQL injection?","What is the difference between UNION-based and blind SQLi?","What are stored procedures and do they prevent SQLi?"]
        },
        {
          name: "XSS",
          explanation: "Cross-Site Scripting (XSS) injects malicious scripts into web pages viewed by other users. Stored XSS persists in the database. Reflected XSS is embedded in the URL. DOM-based XSS manipulates the DOM client-side. Prevention: encode output, use Content Security Policy.",
          beginnerSummary: { en: "XSS injects JavaScript into pages that other users see. Stored XSS saves the payload in the database. Reflected XSS delivers it through the URL. Always encode output and set HttpOnly cookies.", ml: "XSS malicious JavaScript other users-ന്റെ pages-ൽ inject ചെയ്യുന്നു. Stored XSS database-ൽ save ആകുന്നു. Reflected XSS URL-ൽ deliver ആകുന്നു. Output encode ചെയ്ത് HttpOnly cookies set ചെയ്യുക." },
          howToStudy: { en: ["Inject <script>alert('XSS')</script> in a test input", "Understand stored vs reflected vs DOM-based XSS", "Learn how HttpOnly cookie flag prevents XSS-based theft", "Implement output encoding using OWASP Java Encoder"], ml: ["<script>alert('XSS')</script> test input-ൽ inject ചെയ്യുക", "Stored vs reflected vs DOM-based XSS understand ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the difference between stored and reflected XSS?", "How does Content Security Policy prevent XSS?", "Why does HttpOnly flag matter for XSS attacks?", "What is DOM-based XSS?"], ml: ["Stored vs reflected XSS?", "CSP XSS prevent ചെയ്യുന്നത് എങ്ങനെ?"] },
          commonMistakes: { en: ["Sanitizing input but not encoding output (output encoding is what stops XSS)", "Setting CSP to 'unsafe-inline' which defeats the purpose", "Not setting HttpOnly on session cookies"], ml: ["Input sanitize ചെയ്ത് output encode ചെയ്യാൻ forget ആകൽ", "CSP 'unsafe-inline' set ചെയ്യൽ purpose defeat ചെയ്യുന്നു"] },
          practiceTips: { en: ["Practice on DVWA XSS module (low/medium/high security)", "Use Burp Suite to identify and test XSS in a target application", "Build a page, demonstrate reflected XSS, then add output encoding and CSP header"], ml: ["DVWA XSS module practice ചെയ്യുക", "Output encoding ഉം CSP header ഉം add ചെയ്ത് XSS fix ചെയ്യുക"] },
          beginnerTasks: ["Inject <script>alert('XSS')</script> into a test input","Demonstrate stored XSS persisting in a comment section","Show how HttpOnly cookie flag prevents XSS-based cookie theft"],
          practice: ["Build a mini XSS payload to steal a session cookie","Test a form for DOM-based XSS using browser dev tools","Add output encoding in a JSP/HTML template to prevent XSS"],
          miniChallenge: "Build a simple web page, demonstrate reflected XSS, then add proper output sanitization and CSP headers.",
          interviewQs: ["What is the difference between stored and reflected XSS?","How does Content Security Policy prevent XSS?","Why does HttpOnly flag matter for XSS attacks?"]
        }
      ]
    },
    "SOC concepts": {
      overview: "A Security Operations Center (SOC) is the nerve center of an organization's security. SOC analysts monitor, detect, investigate, and respond to security incidents 24/7. Tier 1 analysts triage alerts; Tier 2 investigate; Tier 3 handle advanced threats.",
      subtopics: [
        {
          name: "Alert Triage",
          explanation: "Triage is the process of evaluating incoming security alerts to determine their severity and priority. True positives require investigation and response. False positives are benign events that match rules. The goal is to identify true threats quickly and reduce alert fatigue.",
          beginnerSummary: { en: "Triage means quickly sorting alerts by severity and priority. Most alerts are false positives — the skill is identifying real threats fast. Document everything: what you checked, why you closed/escalated.", ml: "Triage alerts severity ഉം priority ഉം അനുസരിച്ച് sort ചെയ്യുന്നു. മിക്ക alerts false positives ആണ് — real threats fast identify ചെയ്യൽ skill ആണ്." },
          howToStudy: { en: ["Learn the difference between TP, FP, TN, FN in security context", "Study a sample runbook for brute force and malware alerts", "Practice analyzing sample logs and classifying each alert", "Learn Splunk SPL for basic log queries"], ml: ["TP, FP, TN, FN security context-ൽ learn ചെയ്യുക", "Sample runbook study ചെയ്യുക", "Sample logs analyze ചെയ്ത് alerts classify ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the kill chain model?", "What metrics do SOC teams track?", "How do you reduce false positives in a SIEM?", "What is SOAR and how does it help SOC analysts?"], ml: ["Kill chain model?", "SOC teams ഏത് metrics track ചെയ്യുന്നു?"] },
          commonMistakes: { en: ["Closing alerts without documenting your reasoning", "Escalating every alert to Tier 2 without basic triage (alert fatigue)", "Not considering the full context — one event rarely tells the full story"], ml: ["Reasoning document ചെയ്യാതെ alerts close ചെയ്യൽ", "Basic triage ഇല്ലാതെ Tier 2-ലേക്ക് escalate ചെയ്യൽ"] },
          practiceTips: { en: ["Complete TryHackMe SOC Level 1 learning path", "Practice with Blue Team Labs Online free challenges", "Use Splunk free training to learn SPL queries for log analysis"], ml: ["TryHackMe SOC Level 1 learning path complete ചെയ്യുക", "Blue Team Labs Online free challenges practice ചെയ്യുക"] },
          beginnerTasks: ["Define true positive, false positive, true negative, false negative","List the information you check first when triaging an alert","Write a triage decision tree for a failed login alert"],
          practice: ["Analyze a sample alert: 50 failed logins from one IP — is it a threat?","Write a triage runbook for a malware detection alert","Use Splunk to create a dashboard for failed login attempts"],
          miniChallenge: "Given 10 simulated security alerts (brute force, port scan, data exfiltration, normal traffic), categorize and prioritize them with justification.",
          interviewQs: ["What is the kill chain model?","What metrics do SOC teams track?","How do you reduce false positives in a SIEM?"]
        }
      ]
    }
  },

  networking: {
    "OSI Model": {
      overview: "The OSI model standardizes how network systems communicate in 7 layers. Each layer has specific responsibilities and communicates with the layers directly above and below it.",
      subtopics: [
        {
          name: "All 7 Layers",
          explanation: "Layer 1 Physical transmits raw bits. Layer 2 Data Link handles MAC addressing and error detection (Ethernet). Layer 3 Network handles IP addressing and routing. Layer 4 Transport handles TCP/UDP and ports. Layers 5-7 handle sessions, encryption, and application protocols.",
          beginnerSummary: { en: "OSI has 7 layers, each handling a specific part of communication. Routers work at L3, switches at L2. PDUs: bits (L1), frames (L2), packets (L3), segments (L4). Memorize top-down for interviews.", ml: "OSI-ൽ 7 layers ഉണ്ട്, ഓരോന്നും specific communication part handle ചെയ്യുന്നു. Routers L3, switches L2-ൽ. PDUs: bits (L1), frames (L2), packets (L3), segments (L4)." },
          howToStudy: { en: ["Memorize all 7 layers with PDU names", "Map 10 common protocols to their OSI layers", "Explain what a router vs switch does in OSI terms", "Capture Wireshark traffic and label each field with its OSI layer"], ml: ["All 7 layers PDU names ഉൾക്കൊള്ളിച്ച് memorize ചെയ്യുക", "10 common protocols OSI layers-ൽ map ചെയ്യുക"] },
          interviewConcepts: { en: ["What layer does a router vs switch operate at?", "What is PDU at each layer?", "What is encapsulation/decapsulation?", "Which layer does SSL/TLS work at?"], ml: ["Router vs switch ഏത് layer-ൽ?", "PDU ഓരോ layer-ൽ?"] },
          commonMistakes: { en: ["Saying switches work at Layer 3 (managed switches can, but basic switches are Layer 2)", "Forgetting PDU names — bits/frames/packets/segments/data", "Confusing Layer 5 (Session) with Layer 4 (Transport)"], ml: ["Switches Layer 3 ആണ് Layer 2 ആണ് confuse ആകൽ", "PDU names forget ആകൽ"] },
          practiceTips: { en: ["Explain the full journey of an HTTP request across all 7 OSI layers", "Use Wireshark on any HTTP page to see all layers in the packet details pane", "Create a one-page cheat sheet of all 7 layers with protocol examples"], ml: ["HTTP request 7 OSI layers-ൽ journey explain ചെയ്യുക"] },
          beginnerTasks: ["Write the 7 layers from memory with one-line descriptions","Match protocols to their layer (ARP, IP, TCP, HTTP, TLS)","Draw a packet traversing all layers in both directions"],
          practice: ["Explain how a packet changes as it moves down the OSI stack","Identify which layer each attack targets","Capture traffic in Wireshark and identify each header by layer"],
          miniChallenge: "Explain the full journey of an HTTP request from browser to server and back, naming the OSI layer involved at each step.",
          interviewQs: ["What layer does a router vs switch operate at?","What is PDU at each layer?","What is encapsulation/decapsulation?"]
        }
      ]
    },
    "TCP/IP": {
      overview: "TCP (Transmission Control Protocol) ensures reliable, ordered, error-checked delivery. UDP is faster but unreliable — used for streaming, DNS, gaming. The TCP three-way handshake (SYN, SYN-ACK, ACK) establishes connections.",
      subtopics: [
        {
          name: "TCP vs UDP",
          explanation: "TCP is connection-oriented: establishes connection before data transfer, guarantees delivery and order, has flow and congestion control. UDP is connectionless: lower overhead, no guarantee, faster. Use TCP for web, email, file transfer. Use UDP for DNS, VoIP, live video.",
          beginnerSummary: { en: "TCP is reliable but slower — guarantees delivery and order via three-way handshake. UDP is fast but unreliable — no connection setup. Use TCP for accuracy, UDP for speed.", ml: "TCP reliable but slow — three-way handshake delivery guarantee ചെയ്യുന്നു. UDP fast but unreliable — connection setup ഇല്ല. Accuracy-ന് TCP, speed-ന് UDP." },
          howToStudy: { en: ["Draw the TCP three-way handshake: SYN → SYN-ACK → ACK", "List 5 applications using TCP and 5 using UDP with reasons", "Capture a TCP handshake in Wireshark and identify each step", "Explain TCP graceful close (FIN/ACK sequence)"], ml: ["TCP three-way handshake draw ചെയ്യുക", "TCP 5 ഉം UDP 5 ഉം applications list ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the TCP three-way handshake?", "Why is UDP preferred for DNS?", "What is TCP congestion control?", "What is a TCP SYN flood attack?"], ml: ["TCP three-way handshake?", "DNS-ന് UDP prefer ചെയ്യുന്നത് എന്തുകൊണ്ട്?"] },
          commonMistakes: { en: ["Saying UDP is used only for video — DNS, DHCP, SNMP also use UDP", "Not knowing that DNS can use TCP (for zone transfers and responses > 512 bytes)", "Thinking TCP's congestion control and flow control are the same thing"], ml: ["UDP video മാത്രം ആണ് — DNS, DHCP, SNMP ഉം UDP ഉപയോഗിക്കുന്നു", "DNS TCP ഉം use ചെയ്യുന്നു know ചെയ്യൽ"] },
          practiceTips: { en: ["Capture a TCP handshake in Wireshark and label SYN/SYN-ACK/ACK packets", "Identify a UDP DNS query in a pcap file", "Write a comparison table: TCP vs UDP for 10 attributes"], ml: ["Wireshark-ൽ TCP handshake capture ചെയ്ത് label ചെയ്യുക", "UDP DNS query pcap-ൽ identify ചെയ്യുക"] },
          beginnerTasks: ["List 5 applications using TCP and 5 using UDP with reasons","Draw the TCP three-way handshake","Explain TCP's sliding window for flow control"],
          practice: ["Capture a TCP handshake in Wireshark","Identify a UDP DNS query in a pcap file","Explain what happens during TCP connection termination (FIN/ACK)"],
          miniChallenge: "Write a comparison table: TCP vs UDP for 10 attributes. Explain which protocol you'd choose for a live gaming application and why.",
          interviewQs: ["What is the TCP three-way handshake?","Why is UDP preferred for DNS?","What is TCP congestion control?"]
        }
      ]
    }
  },

  aptitude: {
    "Percentages": {
      overview: "Percentages express a value as a fraction of 100. They appear in profit/loss, interest calculations, data interpretation, and many real-world scenarios. Mastering shortcuts saves crucial time in timed aptitude tests.",
      subtopics: [
        {
          name: "Basics and Shortcuts",
          explanation: "x% of y = (x/100) × y. To find what % A is of B: (A/B) × 100. Percentage increase = (Difference/Original) × 100. Multiplying factor for x% increase = 1 + x/100. Successive change: (a + b + ab/100)%.",
          beginnerSummary: { en: "Percentages are fractions of 100. Master the multiplying factor shortcut: x% increase → multiply by (1 + x/100). For successive changes: use (a + b + ab/100) formula instead of calculating step by step.", ml: "Percentages 100-ന്റെ fraction ആണ്. Multiplying factor shortcut: x% increase → (1 + x/100) multiply ചെയ്യുക. Successive changes: (a + b + ab/100) formula ഉപയോഗിക്കുക." },
          howToStudy: { en: ["Memorize key percentage-fraction equivalents (25%=1/4, 33.3%=1/3, etc.)", "Practice the multiplying factor method for faster calculation", "Learn the successive change formula to avoid step-by-step errors", "Solve 20 problems from each category: basic, increase/decrease, successive"], ml: ["Key percentage-fraction equivalents memorize ചെയ്യുക", "Multiplying factor method practice ചെയ്യുക", "Successive change formula learn ചെയ്യുക"] },
          interviewConcepts: { en: ["What is the formula for successive percentage changes?", "How do you find original value after a percentage change?", "Why does a 20% increase followed by 20% decrease result in a net loss?", "What is compound interest formula?"], ml: ["Successive percentage changes formula?", "Percentage change-ക്ക് ശേഷം original value find ചെയ്യുന്നത് എങ്ങനെ?"] },
          commonMistakes: { en: ["Adding percentages directly: 20% + 20% = 40% (WRONG — depends on base)", "Forgetting that a 50% increase then 50% decrease gives a 25% net loss", "Not checking whether % is of original or new value in word problems"], ml: ["Percentages directly add ചെയ്യൽ wrong — base-ന് depend ചെയ്യുന്നു", "50% increase then 50% decrease net loss 25% ആണ്"] },
          practiceTips: { en: ["Solve 10 problems in 10 minutes — speed is key for aptitude tests", "Build a formula sheet: basic %, increase/decrease, successive change, compound interest", "Practice data interpretation problems from old TCS/Infosys question papers"], ml: ["10 problems 10 minutes-ൽ solve ചെയ്യുക — speed key ആണ്", "Formula sheet ഉണ്ടാക്കി practice ചെയ്യുക"] },
          beginnerTasks: ["Calculate 15% of 240","If price increases from 80 to 100, find % increase","Find a number if 25% of it is 50"],
          practice: ["A salary is increased by 20% then decreased by 20% — find net change","Count votes: candidate A gets 55% of 8000 — find margin","Population increases 10% per year — find after 3 years starting from 1000"],
          miniChallenge: "Solve 10 percentage problems in 10 minutes. Target: at least 8 correct without a calculator.",
          interviewQs: ["What is the formula for successive percentage changes?","How do you find original value after a percentage change?","Why does a 20% increase followed by 20% decrease result in a net loss?"]
        }
      ]
    }
  }
};
