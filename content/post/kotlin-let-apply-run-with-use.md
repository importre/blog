---
categories: [kotlin]
date: 2015-12-23T18:23:05+09:00
homepage: ""
tags: [let, with, run, apply, use]
title: let, with, run, apply, use
---

혹시 코틀린에서 `let`, `run`, `apply` 함수를 보신적이 있으신가요?
안드로이드를 개발할 때 코틀린을 사용하고 있는데, 자동완성할 때 위와 같은 함수들이 떠서 뭐길래 뜨는지 궁금해서 찾아보았습니다.

이번 글은 위와같이 코틀린에서 미리 정의된 몇몇 함수들에 대해 설명하고자 합니다.
설명할 함수는 아래와 같이 정의되어 있습니다.

```kotlin
public inline fun <T, R> T.let(f: (T) -> R): R = f(this)
public inline fun <T, R> with(receiver: T, f: T.() -> R): R = receiver.f()
public inline fun <T, R> T.run(f: T.() -> R): R = f()
public inline fun <T> T.apply(f: T.() -> Unit): T { f(); return this }
public inline fun <T : Closeable, R> T.use(block: (T) -> R): R { /* 생략 */ }
```


## let

### 함수 원형
```kotlin
public inline fun <T, R> T.let(f: (T) -> R): R = f(this)
```

임의의 `T` 타입에 `let`이라는 함수를 확장([Extension][extensions])했고,
`let`의 파라미터로는 타입이 `(T) -> R` 인 람다 `f`를 갖습니다.

결과적으로 `f(this)`를 호출하고, 람다의 리턴값인 타입 `R`을 그대로 리턴합니다.

> `f`를 호출할 때 넘기는 `this`는 `T`의 인스턴스이기 때문에
> `f` 블럭 내에서 첫번째 파라미터로 사용 가능한 것입니다.

### 예제
보통 **not** `null`인 경우 해당 블럭을 실행하는데 쓰입니다.

```kotlin
File("/usr/local").list()?.let {
    // `it`은 File("/usr/local").list()이 되겠지요.
    println(it.size)
}
```

참고로 자바라면 아래와 같이 사용했을 것입니다.

```kotlin
val files = File("/usr/local").list()
if (files != null) {
    println(files.size)
}
```


## with

### 함수 원형
```kotlin
public inline fun <T, R> with(receiver: T, f: T.() -> R): R = receiver.f()
```

앞서 살펴본 `let`과 다르게 `T`를 확장하지 않고 `with`의 첫번째 파라미터(`receiver`)로 넘깁니다.
`with`는 결과적으로 `receiver.f()`를 실행하고 `f`의 리턴값을 그대로 리턴합니다.

두번째 파라미터의 원형은 `T.() -> R`로 되어있는데, `T` 옆에 `.`이 보이시나요?
우리가 알고있는 람다의 일반적인 정의와는 조금 다른 모양을 취하고 있습니다.
간단히 설명드리자면, 두번째 파라미터인 람다 내부에서는 `T`의 접근 가능한 멤버 함수와 변수를 `dot notation`없이 바로 사용할 수 있습니다.
자세한 설명은 [Function Literals with Receiver [1]][fun-liternal-receiver1]과 [[2]][fun-liternal-receiver2]를 참고바랍니다.


### 예제
```kotlin
// User 클래스가 아래와 같을 때,
data class User(val name: String,
                var email: String? = null,
                var profile: String? = null)

val user = User("importre")

// `User`의 멤버 변수인 `email`, `profile`을
// `with` 블럭 내에서 바로 접근하는 것을 확인할 수 있습니다.
with (user) {
    email = "importre@example.com"
    profile = "http://path/to"
}
println(user)
```

실행 결과는 아래와 같습니다.

```sh
User(name=importre, email=importre@example.com, profile=http://path/to)
```


## run

### 함수 원형
```kotlin
public inline fun <T, R> T.run(f: T.() -> R): R = f()
```

원형을 보면`let`과 `with`가 합쳐진 것을 알 수 있습니다.

### 예제 {#run-example}
```kotlin
val user = User("importre").run {
    email = "importre@example.com"
    profile = "http://path/to"
    this
}
```

run의 리턴 값이 `R`이기 때문에 `User`를 쓰고 싶으면 `this`를 리턴해주면 됩니다.


## apply

### 함수 원형
```kotlin
public inline fun <T> T.apply(f: T.() -> Unit): T { f(); return this }
```

`run`과 상당히 비슷해보이죠? `f`의 리턴 값은 아무 것도 없고(`Unit`),
그냥 `f`를 실행한 다음에 `this`를 리턴합니다.

### 예제
```kotlin
val user = User("importre").apply {
    email = "importre@example.com"
    profile = "http://path/to"
}
```

[run의 예제]({{< ref "#run-example" >}})와 동일하게 동작하는 예제입니다.
`Builder` 패턴이 구현되지 않은 클래스를 초기화를 할 때 아주 유용해 보입니다.


## use

### 함수 원형
```kotlin
public inline fun <T : Closeable, R> T.use(block: (T) -> R): R { ...... }
```

`Closeable` 인터페이스가 구현된 클래스에 한해 `use`를 사용하실 수 있습니다.
[내부 구현][use-code]을 보면 `Exception`이 발생하거나 말거나 항상 `close()`를 호출을 보장합니다.

> [내부 구현][use-code]의 TODO 주석을 보니 패키지도 바뀌고 `using`으로 바뀌려나 봅니다.

### 예제
```kotlin
PrintWriter(FileOutputStream("output.txt")).use {
    it.println("hello")
}
```

`output.txt` 파일에 `hello`라는 문자열을 저장하는 코드입니다.
일반적으로 파일 작업을 하고나면 `close()`를 명시적으로 호출해야하는데,
`use` 블럭 내에서는 그럴 필요가 없습니다.

`Closeable` 인스턴스가 아닌 다른 인스턴스를 사용하는데 위와 같이 반드시 처리해야하는 일이 있다면 `use`와 같이 새로운 함수를 정의해서 특정 객체를 확장하는 것도 생각해볼 만합니다. :^)


## 정리

- 몰라도 되는 것이지만 알면 꿀!





[extensions]: https://goo.gl/EN6bTs
[use-code]: https://goo.gl/nHreuO
[fun-liternal-receiver1]: {{< relref "kotlin-function-literals-with-receiver.md" >}}
[fun-liternal-receiver2]: https://goo.gl/yo7b85
