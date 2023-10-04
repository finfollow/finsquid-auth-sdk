*Hej*


{% codetabs %}
{% codetab Kotlin %}
```kotlin
val result = PasswordTester.getInstance().testPassword("test")
```
{% endcodetab %}
{% codetab Swift %}
```swift
let strength = PasswordTester.shared.testPassword("test")
```
{% endcodetab %}
{% endcodetabs %}