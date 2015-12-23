---
categories: [kotlin]
date: 2015-12-23T18:23:05+09:00
homepage: ""
tags: [let, with, run, apply, use]
title: let, with, run, apply, use
draft: true
---

혹시 코틀린에서 `let`, `run`, `apply` 함수를 보신적이 있으신가요?
안드로이드를 개발할 때 코틀린을 사용하고 있는데, 자동완성할 때 위와 같은 함수들이 뜨곤 합니다.

이번 글은 위와같이 코틀린에서 미리 정의된 몇몇 함수들에 대해 설명하고자 합니다.
설명할 함수는 아래와 같이 정의되어 있습니다.

```kotlin
public inline fun <T, R> T.let(f: (T) -> R): R = f(this)
public inline fun <T, R> with(receiver: T, f: T.() -> R): R = receiver.f()
public inline fun <T, R> T.run(f: T.() -> R): R = f()
public inline fun <T> T.apply(f: T.() -> Unit): T { f(); return this }
public inline fun <T : Closeable, R> T.use(block: (T) -> R): R { ...... }
```


## let

### 함수 원형
```kotlin
public inline fun <T, R> T.let(f: (T) -> R): R = f(this)
```

`T` 객체에 `let`이라는 함수를 확장(Extension)했고, `let`의 파라미터로는 람다 `f`를 갖습니다.

첫번째 파라미터인 `f`를 호출할 때 `this`, 즉 `T`의 인스턴스를 넘기고, `f`의 리턴값 `R`을 그대로 리턴합니다.

### 예제
보통 **not** `null`인 경우 해당 블럭을 실행하는데 쓰입니다.

```kotlin
File("/usr/local").list()?.let {
    println(it.size)  // `it`은 File("/usr/local").list()이 되겠지요.
}
```

자바라면 아래와 같이 사용했을 것입니다.

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

앞서 살펴본 `let`과 다르게 `T`를 확장하지 않고 `with`의 첫번째 파라미터로 넘깁니다.

두번째 파라미터의 원형은 `T.() -> R`로 되어있는데, 우리가 알고있는 코틀린의 람다와는 조금 다른 모양을 취하고 있습니다. 이는 [Function Literals with Receiver]({{< ref "post/kotlin-function-literals-with-receiver.md" >}})를 참고바랍니다.
간단히 설명드리면, 두번째 파라미터인 람다 내부에서는 T의 접근 가능한 멤버 함수, 변수를 `dot notation`없이 바로 사용할 수 있습니다.

`with`는 `receiver.f()`를 실행하고 `f`의 리턴값을 그대로 리턴합니다.

### 예제

```kotlin
// User 클래스가 있다고 가정하고,
data class User(val name: String,
                var email: String? = null,
                var profile: String? = null)

val user = User("importre")
with (user) {
    email = "a@b.com"
    profile = "http://path/to"
}
println(user)
```

`User`의 멤버 변수인 `email`, `profile`을 `with` 블럭 내에서 바로 접근하는 것을 확인할 수 있습니다.
실행 결과는 아래와 같습니다.

```sh
User(name=importre, email=a@b.com, profile=http://path/to)
```


## run

### 함수 원형
```kotlin
public inline fun <T, R> T.run(f: T.() -> R): R = f()
```

원형을 보면 `let`과 `with`가 합쳐진 것과 같습니다.

### 예제
```kotlin
val user = User("importre").run {
    email = "a@b.com"
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

`run`과 상당히 비슷해보이죠? `f`의 리턴 값은 아무 것도 없고, `f`를 실행하고, `this`를 리턴합니다.

### 예제
```kotlin
val user = User("importre").apply {
    email = "a@b.com"
    profile = "http://path/to"
}
```

`run`의 예제와 동일하게 동작하는 예제입니다. `Builder` 패턴이 구현되지 않은 클래스를 초기화를 할 때 아주 유용해 보입니다.


## use

### 함수 원형
```kotlin
public inline fun <T : Closeable, R> T.use(block: (T) -> R): R { ...... }
```

`Closeable` 인터페이스가 구현된 클래스에 한해 `use`를 사용하실 수 있습니다.
내부 구현을 보면 `Exception`이 발생하건 안하건 항상 `close()`를 보장하는 것을 알 수 있습니다.

