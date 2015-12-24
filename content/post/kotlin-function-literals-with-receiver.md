---
categories: [kotlin]
date: 2015-12-24T20:33:15+09:00
homepage: ""
tags: [function, literal, receiver, anko]
title: Function Literals with Receiver
---

코틀린에서는 리시버 객체와 함께 함수 리터럴을 호출할 수 있는 기능을 제공합니다.
함수 리터럴 안에서는 리시버의 메소드와 변수를 바로 사용할 수 있습니다.

이해를 돕기위해 [이전 포스트][prev]에서 살펴보았던 `run`과 함께 아래와 같은 상황을 가정해 보겠습니다.

> 안드로이드에서 CurrentActivity의 CurrentFragment에서 AnotherActivity를 호출할 때

```kotlin
class CurrentFragment : Fragment() {
    // ...
    private fun startAnotherActivity() {
        // 이전 포스트에서 살펴보았던 `run`
        activity?.run {
            val intent = Intent(this, AnotherActivity::class.java)

            // CurrentFragment가 Attach된 Activity의
            // `startActivity`와 `finish`를 호출합니다.
            startActivity(intent)
            finish()
        }
    }
    // ...
}
```

이전 포스트에서 설명했던 `run`의 원형을 다시 살펴보면 아래와 같은데,

```kotlin
public inline fun <T, R> T.run(f: T.() -> R): R = f()
```

위의 예에서 `run`에 넘기는 함수 리터럴의 타입은 바로 `T.() -> R`,
다시 말하면 `CurrentActivity.() -> Unit`을 의미합니다.

## 활용

**Function Literals with Receiver**를 활용한 대표적인 예로는
[Type Safe Builder][type-safe-builder]가 있습니다.
또한 [Anko][anko] 역시 이를 활용한 JetBrains의 안드로이드 라이브러리로,
xml 대신에 DSL로 UI를 그릴 수 있도록 도와줍니다.

아래의 예를 보면 **Function Literals with Receiver**를 활용한 느낌이 날 것입니다.

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    verticalLayout {
        padding = dip(30)
        editText {
            hint = "Name"
            textSize = 24f
        }
        editText {
            hint = "Password"
            textSize = 24f
        }
        button("Login") {
            textSize = 26f
        }
    }
}
```

## 정리

- 이를 이용한 또 다른 활용방안 생각해보기



[anko]: https://github.com/Kotlin/anko
[type-safe-builder]: https://kotlinlang.org/docs/reference/type-safe-builders.html
[prev]: {{< relref "kotlin-let-apply-run-with-use.md" >}}
