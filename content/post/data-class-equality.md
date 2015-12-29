---
categories: [kotlin]
date: 2015-12-29T20:22:53+09:00
draft: false
tags: [data, equality, array, equals, collection, rx]
title: Data class and Equality
description: 코틀린의 data 클래스와 equals 사용시 주의할 점에 대해 살펴보고, RxJava와 함께 활용할 수 있는 방안에 대해 생각해봅니다.
---

애플리케이션을 만들다보면 모델에 해당하는 클래스를 만들게 될 것입니다.
그러한 클래스들은 일반적으로 딱히 뭐 하는 것도 없고 데이터만 들고 있게되죠.

코톨린에서는 그러한 클래스를 특별히 정의할 수 있고, 그로인해 득되는 것들이 몇가지 있습니다.


## 데이터 클래스

### 선언
데이터 클래스를 선언하는 방법은 `data`를 `class` 선언하기 전에 써주면 됩니다. 간단하죠?

```kotlin
data class User(val name: String, val age: Int)
```

### 제약사항
단, 몇가지 제약사항이 있습니다.

- 반드시 `primary constructor`가 필요함
    - 1개 이상의 파라미터가 반드시 존재해야 하고, 모든 파라미터는 `val`/`var`로 정의해야 함
    - 참고로 [primary constructor][constructor]란 클래스 헤더에 존재하고, 클래스 이름 뒤에 정의하는 생성자를 의미함
- `abstract`, `open`, `sealed` or `inner` 클래스가 아니어야 함
- `interface`를 확장하는 것 외에 다른 클래를 확장 불가

보다 자세한 조건과 이러한 제한이 생긴 이유는 [이 글][data-class-limit]을 참고하세요.

### 얻는 효과
`data`를 선언함과 동시에 코틀린 컴파일러는 고맙게도 아래와 같은 일을 자동으로 해줍니다.

- `equals()`/`hashCode()` 쌍으로 생성
- `toString()` 생성 (`primary constructor`에 선언된 프로퍼티들을 예쁘게 보여줌)
- 선언된 프로퍼티에 상응하는 `componentN()` 함수들 생성
    - [destructing]할 때 사용할 수 있음
- `copy()` 생성

> 제목이 `Data class and Equality`인 이유는
> `equals` 함수를 사용할 때 조심해야할 부분이 있기 때문입니다.  
> `Equality`로 넘어가봅시다.


## Equality

코틀린에서는 동등 비교를 할 때 2가지 타입이 있습니다.

- 같은 레퍼런스인지 (동일한 객체를 가리키는지)
    - `==` 연산자가 아닌 `===` 연산자로 비교합니다.
- 구조적으로 같은 형태인지
    - `==` 연산자가 `equals`와 동일하게 동작합니다.

그럼 `data` 클래스인 경우와 그렇지 않은 경우에 동등 비교의 결과를 여러가지 예제를 통해 살펴봅시다.  
참고로 아래 나오는 예제는 모두 테스트 케이스를 통과한 [코드][examples]입니다.

> kotlin 1.0 beta 4 이후로는 test와 관련된 의존성을 따로 추가해야 사용이 가능합니다. [[참고]][test]

### User
`name`을 가지는 `User`클래스를 **`data`인 것**과 **그렇지 아니한 것**으로 테스트를 해보았습니다.

```kotlin
class User(val name: String)
data class UserData(val name: String)

@Test
fun testUser() {
    val u1 = User("heo")
    val u2 = User("heo")
    assertNotEquals(u1, u2)   // 데이터 클래스가 아닌 경우는 다름
}

@Test
fun testUserData() {
    val u1 = UserData("heo")
    val u2 = UserData("heo")
    assertEquals(u1, u2)      // 데이터 클래스인 경우는 같음
}
```

### User with List
그럼 `emails`라는 `Collection`(여기서는 `List`)을 가진 `User` 클래스라면 어떻게 될까요?

```kotlin
class UserWithList(val name: String, val emails: List<String>)
data class UserDataWithList(val name: String, val emails: List<String>)

@Test
fun testList() {
    // list
    assertEquals(listOf("a@b.com", "c@d.com"), 
            listOf("a@b.com", "c@d.com"))
    // nested list
    assertEquals(listOf(listOf("a@b.com"), listOf("c@d.com")),
            listOf(listOf("a@b.com"), listOf("c@d.com")))
}

@Test
fun testUserWithList() {
    val u1 = UserWithList("heo", listOf("a@b.com", "c@d.com"))
    val u2 = UserWithList("heo", listOf("a@b.com", "c@d.com"))
    assertNotEquals(u1, u2)
}

@Test
fun testUserDataWithList() {
    val u1 = UserDataWithList("heo", listOf("a@b.com", "c@d.com"))
    val u2 = UserDataWithList("heo", listOf("a@b.com", "c@d.com"))
    assertEquals(u1, u2)
}
```

결과는 예상했던 바와 같이 `data`로 선언하면 구조적으로 같은 경우에는 동등함을 알 수 있습니다.

> 리스트가 중첩된 경우도 구조만 같다면 동등하다는 것을 알 수 있습니다.

### User with Map

`Map`은 어떨까요?

```kotlin
class UserWithMap(val name: String, val emails: Map<Int, String>)
data class UserDataWithMap(val name: String, val emails: Map<Int, String>)

@Test
fun testUserWithMap() {
    val u1 = UserWithMap("heo", mapOf(0 to "a@b.com", 1 to "c@d.com"))
    val u2 = UserWithMap("heo", mapOf(0 to "a@b.com", 1 to "c@d.com"))
    assertNotEquals(u1, u2)
}

@Test
fun testUserDataWithMap() {
    val u1 = UserDataWithMap("heo", mapOf(0 to "a@b.com", 1 to "c@d.com"))
    val u2 = UserDataWithMap("heo", mapOf(1 to "c@d.com", 0 to "a@b.com"))
    assertEquals(u1, u2)
}
```

`Map` 역시 마찬가지입니다.

`List`, `Map` 등과 같은 `Collection`들은 구조적으로 비교하기 때문에
`data` 클래스로 선언된 경우에는 동등하다고 알려줍니다.

### User with Array

그렇다면 `Array`는 어떨까요?

```kotlin
class UserWithArray(val name: String, val emails: Array<String>)
data class UserDataWithArray(val name: String, val emails: Array<String>)

@Test
fun testUserWithArray() {
    val a1= arrayOf("a@b.com", "c@d.com")
    val a2= arrayOf("a@b.com", "c@d.com")
    assertNotEquals(a1, a2)
    
    val u1 = UserWithArray("heo", a1)
    val u2 = UserWithArray("heo", a2)
    assertNotEquals(u1, u2)
}

@Test
fun testUserDataWithArray() {
    val u1 = UserDataWithArray("heo", arrayOf("a@b.com", "c@d.com"))
    val u2 = UserDataWithArray("heo", arrayOf("a@b.com", "c@d.com"))
    assertNotEquals(u1, u2) // data 클래스이지만 Not Equals
}
```

`Array`는 `data`로 선언해도 같다고 하질 않습니다!!!

#### 코틀린에서 `Array`는 항상 레퍼런스를 비교합니다.

- 콤포넌트로 선언된 배열은 구조적으로 비교하는데
- 중첩된 구조에서 하위 배열은 `equals`로 비교하게되고,
- `Any`나 `T`로 선언된 경우에는 런타임에 비교하기 때문에 모순되는 상황이 발생합니다.

그래서 다 필요 없고 그냥 레퍼런스만 비교합니다.
보다 자세한 사항은 [이 글][data-class-limit]의 아래쪽을 살펴보세요.

## 응용하기

[retrofit]과 [RxJava]를 함께 사용할 때, retrofit의 응답으로 넘어오는 데이터의 정의를
`data`로 사용하면 좋습니다.

사실 굳이 `data`로 선언하지 않아도 되긴 하지만,
아래와 같은 시나리오에서는 아주 유용하게 사용할 수 있습니다.

시나리오는 아주 간단합니다.

> retrofit으로 서버에 데이터를 요청하고, 응답으로 온 결과를 화면에 보여줘야 한다.  
> 이 때, 사용자가 화면을 새로고침을 실행했다.
> 하지만 결과가 같아서 굳이 여러번 화면을 갱신할 필요가 없다면...

[RxJava]의 `Observable`을 사용할 때 [replay(cache)][cache]와
[distinct 또는 distinctUntilChanged][distinct]를 이용하면 훌륭하게 처리할 수 있습니다.

아시다시피 `cache`를 사용하게 되면
이전에 요청했던 결과는 `subscribe`하는 즉시 `onNext`로 넘어오게 되는데,
새로고침을 하더라도 `distinct`에 의해 `onNext`가 두 번 호출되는 것을 막을 수 있습니다.  
따라서, 화면 갱신하는 부분을 자연스럽게 한 번만 호출 할 수 있게 됩니다.  
아주 좋지요?

### Test with Rx
`cache`는 이 글에서 논 외로 치고, `equals`에 초첨을 맞춘 예제입니다.

`distinctUntilChanged` 오퍼레이터에 의해
이전에 방출된 데이터가 다를 때에만 `onNext`가 호출되는 것을 확인하실 수 있습니다.

```kotlin
@Test
fun testWithRx() {
    val users = arrayOf(
            UserDataWithList("heo", listOf("a@b.com", "c@d.com")),
            UserDataWithList("heo", listOf("a@b.com", "c@d.com")),
            UserDataWithList("kim", listOf("a@b.com", "c@d.com")),
            UserDataWithList("heo", listOf("a@b.com", "c@d.com")),
            UserDataWithList("heo", listOf("a@b.com", "c@d.com"))
    )

    val count = CountDownLatch(users.size)
    Observable.from(users)
            .distinctUntilChanged()
            .observeOn(Schedulers.newThread())
            .subscribe {
                count.countDown()
                println(it)
            }

    count.await(1, TimeUnit.SECONDS)
    assertEquals(2, count.count) // 2개가 남아야 함
}
```

위의 결과는 아래와 같습니다.

```
UserDataWithList(name=heo, emails=[a@b.com, c@d.com])
UserDataWithList(name=kim, emails=[a@b.com, c@d.com])
UserDataWithList(name=heo, emails=[a@b.com, c@d.com])
```


## 정리

`data`클래스와 `equality`에 대해 살펴보았습니다.  
일단은 `data`클래스에서 `Array`를 사용하면
**동등비교가 되지 않음**에 유의하면 될 것 같습니다(스펙이 바뀌는지도 잘 살펴봐야 할 듯 하네요).

[RxJava]의 오퍼레이터 중에서 `equals`를 사용하는 경우,
`data`클래스와 함께 아주 유용하게 사용할 수 있습니다.




[kotlinlang.org]: https://kotlinlang.org/
[idiom]: https://kotlinlang.org/docs/reference/idioms.html
[data-class]: https://kotlinlang.org/docs/reference/data-classes.html
[data-class-limit]: http://goo.gl/L0QVRb
[rx]: http://reactivex.io/
[distinct]: http://reactivex.io/documentation/operators/distinct.html
[retrofit]: https://github.com/square/retrofit
[destructing]: https://kotlinlang.org/docs/reference/multi-declarations.html
[RxJava]: https://github.com/ReactiveX/RxJava
[debounce]: http://reactivex.io/documentation/operators/debounce.html
[cache]: http://reactivex.io/documentation/operators/replay.html
[constructor]: https://kotlinlang.org/docs/reference/classes.html#constructors
[examples]: https://goo.gl/suX3uZ
[test]: https://goo.gl/7I8dKf
