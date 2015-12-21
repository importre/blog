---
author: ""
categories: [kotlin]
date: 2015-12-21T17:59:55+09:00
homepage: ""
tags: [gradle, JvmName, "@file"]
title: kotlin with gradle
---

## 프로젝트 폴더 초기화

아래와 같은 명령을 통해 프로젝트 폴더(여기서는 `playkotlin`)를 초기화를 한다.  
여기서 Gradle은 2.9를 사용하였다. 

```sh
$ mkdir playkotlin && cd $_
$ gradle init
```

결과는 아래와 같다.

```sh
$ tree
.
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
└── settings.gradle

2 directories, 6 files
```

## build.gradle 작성

생성된 `build.gradle` 파일을 아래와 같이 작성한다. 보다 자세한 내용은 [여기][using-gradle]를 참고하라.

```gradle
buildscript {
    ext.kotlin_version = '1.0.0-beta-3595'

    repositories {
        jcenter()
    }

    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

apply plugin: 'kotlin'

sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
}

repositories {
    jcenter()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
}
```


## main 메소드 작성하기

패키지(여기서는 `io.github.importre.playkotlin`) 폴더를 만들고,

```sh
$ mkdir -p src/main/kotlin/io/github/importre/playkotlin
```

`main.kt` 파일을 생성하여 아래와 같이 작성한다.

```kotlin
package io.github.importre.playkotlin

fun main(args: Array<String>) {
    println("hello playkotlin")
}
```


## 실행하기

[`application` 플러그인][application-plugin]을 이용하여
Gradle로 실행할 수 있도록 `build.gradle`에 아래 라인을 추가한다.


```gradle
apply plugin: 'application'

mainClassName = "io.github.importre.playkotlin.MainKt"
```

최종 수정된 파일은 [여기][build.gradle]를 참고하라.

> 메인 클래스 이름이 `MainKt` 인 이유는 [kotlinc(코틀린 컴파일러)][kotlinc]에 의해 자동 생성됐기 때문이다.

> 자바와 다르게 코틀린은 파일에서 항상 클래스를 가질 필요가 없다.
> 하지만 `.class` 파일을 생성한다. 생성되는 파일의 이름을 바꾸려면 `package`를 선언하기 전에
> `@file:JvmName()`을 사용하면 원하는 이름으로 생성할 수 있다.  
> 보다 자세한 예는 [여기][calling-kt-from-java]를 참고하라.

`application` 플러그인의 `run` task를 이용하여 실행하면 아래와 같은 결과를 확인할 수 있다.

```sh
$ ./gradlew run

:compileKotlin
:compileJava UP-TO-DATE
:processResources UP-TO-DATE
:classes UP-TO-DATE
:run
hello playkotlin

BUILD SUCCESSFUL

Total time: 4.978 secs
```


## 결론

- [Gradle init의 type][gradle-init]에 `kotlin-library`가 있었으면 좋겠다.
- 당연한 얘기지만 IntelliJ를 사용하면 편하다.
- 최종 소스는 [여기][playkotlin]에 있다.



[using-gradle]: https://goo.gl/L0iVVX
[application-plugin]: https://goo.gl/00pKf3
[build.gradle]: https://goo.gl/Ed6Vy5
[calling-kt-from-java]: https://goo.gl/BVa2CR
[kotlinc]: https://goo.gl/XkRvXS
[gradle-init]: https://goo.gl/MEsvt5
[playkotlin]: https://goo.gl/KIupk2
