<!--#region:intro-->
# Cryptographically Secure Pseudo-Random Number Generation (CSPRNG) for ECMAScript

This proposes the addition of a user-addressable function that can be used to fill the 
portion of an `ArrayBuffer` associated with a `TypedArray` with cryptographically secure pseudo-random number values.

Portions of this proposal are derived from the [Web Cryptography API][WebCrypto]:

> The [Web Cryptography API][WebCrypto] is Copyright &#xA9; 2018 [World Wide Web Consortium](http://www.w3.org/), ([MIT](http://www.csail.mit.edu/), 
[ERCIM](http://www.ercim.org/), [Keio](http://www.keio.ac.jp/), [Beihang](http://ev.buaa.edu.cn/)). http://www.w3.org/Consortium/Legal/2015/doc-license
>
> The [Web Cryptography API][WebCrypto] is an Editors Draft, per the [February 2018 W3C Process Document](https://www.w3.org/2018/Process-20180201/).

<!--#endregion:intro-->

<!--#region:status-->
## Status

**Stage:** 1  
**Champion:** Ron Buckton (@rbuckton)  

_For detailed status of this proposal see [TODO][], below._  
<!--#endregion:status-->

<!--#region:authors-->
## Authors

* Ron Buckton (@rbuckton)  
<!--#endregion:authors-->

<!--#region:motivations-->
# Motivations

One of the [key issues](https://github.com/tc39/proposal-uuid/issues/37) for https://github.com/tc39/proposal-uuid is the lack
of a "source of truth" for cryptographically secure pseudo-random numbers within the ECMAScript language. While hosts such as 
browsers and NodeJS provide implementations of CSPRNGs (Cryptographically Secure Pseudo-Random Number Generators), the ECMAScript
language itself has no mechanism for supplying a CSPRNG that can be used by proposed APIs such as [UUID][].

### Goals

* Provide a single "source of truth" for generating cryptographically secure pseudo-random number values within the language.
* Provide a single location for mocking the CSPRNG, vs a method on each `TypedArray` prototype.
* If introducing a new `crypto` global namespace for cryptography-related APIs in ECMA-262, we should ensure that the Web Cryptography APIs could be layered on top.
<!--#endregion:motivations-->

<!--#region:prior-art-->
# Prior Art 

* Web Cryptography API: [`crypto.getRandomValues`](https://w3c.github.io/webcrypto/#Crypto-method-getRandomValues)
* NodeJS: [`crypto.randomFillSync`](https://nodejs.org/dist/latest-v13.x/docs/api/crypto.html#crypto_crypto_randomfillsync_buffer_offset_size)
<!--#endregion:prior-art-->

<!--#region:syntax-->
<!--
# Syntax

> TODO: Provide examples of syntax.

```js
```
-->
<!--#endregion:syntax-->

<!--#region:semantics-->
<!--
# Semantics

> TODO: Describe static and runtime semantics of the proposal.
-->
<!--#endregion:semantics-->

<!--#region:examples-->
# Examples

```js
const array = new Uint8Array(16);
crypto.getRandomValues(array); // returns `array`
```

<!--#endregion:examples-->

<!--#region:api-->
# API

# The `crypto` Object

This proposal introduces a global `crypto` object that is intended to be compatible with the implementation in the [Web Cryptography API][WebCrypto]. 
As such, the global `crypto` object is defined as being a reference to a built-in %crypto% object, which in turn has its \[\[Prototype]] internal slot that points to a built-in %CryptoPrototype% object to which API methods are attached. This is intended to preserve the prototype hierarchy inherent in the WebIDL
definition for the [Crypto interface](https://w3c.github.io/webcrypto/#crypto-interface). 

To support spec layering with the Web Cryptography API, WebIDL attributes like `subtle` can be defined by a host to exist on the %crypto% built-in object, and additional members of the Crypto interface could be defined on the %CryptoPrototype% built-in object.

## Properties of the %CryptoPrototype% object

The %CryptoPrototype% object is intended to represent the minimal subset of the [Crypto interface](https://w3c.github.io/webcrypto/#crypto-interface) from the [Web Cryptography API][WebCrypto] necessary to implement this proposal. This would allow the Web Cryptography API to layer its implementation on top of the specification in this proposal in a web-compatible
way.

### %CryptoPrototype%.getRandomValues ( array )

When getRandomValues is called with argument _array_, the following steps are taken:

1. Perform ? RequireInternalSlot(_array_, \[\[TypedArrayName]]).
1. Assert: _array_ has the \[\[ViewedArrayBuffer]], \[\[ByteLength]], and \[\[ByteOffset\]\] internal slots.
1. If _array_.\[\[TypedArrayName]] is not one of `"Int8Array"`, `"Uint8Array"`, `"Uint8ClampedArray"`, `"Int16Array"`, `"Uint16Array"`, `"Int32Array"`, `"Uint32Array"`, `"BigInt64Array"`, or `"BigUint64Array"`, throw a **TypeError** exception.
1. Let _buffer_ be _array_.\[\[ViewedArrayBuffer]].
1. If ! IsDetachedBuffer(_buffer_) is **true**, throw a **TypeError** exception.
1. Let _byteLength_ be _array_.\[\[ByteLength]].
1. If _byteLength_ is greater than 65536, throw a **RangeError** exception.
1. Let _byteOffset_ be _array_.\[\[ByteOffset]].
1. Let _byteEndOffset_ be _byteOffset_ + _byteLength_.
1. Overwrite the elements of _buffer_ from index _byteOffset_ (inclusive) through index _byteEndOffset_ (exclusive) with cryptographically secure random values.
1. Return _array_.

> **Note**  
> Implementations should generate cryptographically secure random values using well-established cryptographic pseudo-random number generators seeded with high-quality entropy, such as from an operating-system entropy source (e.g., "/dev/urandom"). This specification provides no lower-bound on the information theoretic entropy present in cryptographically secure random values, but implementations should make a best effort to provide as much entropy as practicable.

> **Note**  
> This interface defines a synchronous method for obtaining cryptographically secure random values. While some devices and implementations may support truly random cryptographic number generators or provide interfaces that block when there is insufficient entropy, implementations are discouraged from using these sources when implementing getRandomValues, both for performance and to avoid depleting the system of entropy. Instead, these sources should be used to seed a cryptographic pseudo-random number generator that can then return suitable values efficiently.

### %CryptoPrototype% [ @@toStringTag ]

The initial value of the \@\@toStringTag property of %CryptoPrototype% is the String value `"Crypto"`.
<!--#endregion:api-->

<!--#region:grammar-->
<!--
# Grammar

> TODO: Provide the grammar for the proposal. Please use [grammarkdown][Grammarkdown] syntax in 
> fenced code blocks as grammarkdown is the grammar format used by ecmarkup.

```grammarkdown
```
-->
<!--#endregion:grammar-->

<!--#region:references-->
# References

* [Web Cryptography API][WebCrypto] ([GitHub](https://github.com/w3c/webcrypto))
* [UUID Proposal][UUID]  
<!--#endregion:references-->

<!--#region:prior-discussion-->
# Prior Discussion

* *Separate proposal for CSPRNG "source of truth"*: https://github.com/tc39/proposal-uuid/issues/37  
* *Math.urandom() in ECMAScript*: https://github.com/tc39/proposal-uuid/issues/31
* *Using Math.getRandomValues()*: https://github.com/w3c/webcrypto/issues/227
<!--#endregion:prior-discussion-->

<!--#region:todo-->
# TODO

The following is a high-level list of tasks to progress through each stage of the [TC39 proposal process](https://tc39.es/process-document/):

### Stage 1 Entrance Criteria

* [x] Identified a "[champion][Champion]" who will advance the addition.  
* [x] [Prose][Prose] outlining the problem or need and the general shape of a solution.  
* [x] Illustrative [examples][Examples] of usage.  
* [x] High-level [API][API].  

### Stage 2 Entrance Criteria

* [x] [Initial specification text][Specification].  
* [ ] ~~[Transpiler support][Transpiler] (_Optional_).~~  

### Stage 3 Entrance Criteria

* [ ] [Complete specification text][Specification].  
* [ ] Designated reviewers have [signed off][Stage3ReviewerSignOff] on the current spec text.  
* [ ] The ECMAScript editor has [signed off][Stage3EditorSignOff] on the current spec text.  

### Stage 4 Entrance Criteria

* [ ] [Test262](https://github.com/tc39/test262) acceptance tests have been written for mainline usage scenarios and [merged][Test262PullRequest].  
* [ ] Two compatible implementations which pass the acceptance tests: [\[1\]][Implementation1], [\[2\]][Implementation2].  
* [ ] A [pull request][Ecma262PullRequest] has been sent to tc39/ecma262 with the integrated spec text.  
* [ ] The ECMAScript editor has signed off on the [pull request][Ecma262PullRequest].  
<!--#endregion:todo-->

[Process]: https://tc39.es/process-document/
[Proposals]: https://github.com/tc39/proposals/
[Grammarkdown]: http://github.com/rbuckton/grammarkdown#readme
[Champion]: #status
[Prose]: #motivations
[Examples]: #examples
[API]: #api
[TODO]: #todo
[Specification]: #todo
[Transpiler]: #todo
[Stage3ReviewerSignOff]: #todo
[Stage3EditorSignOff]: #todo
[Test262PullRequest]: #todo
[Implementation1]: #todo
[Implementation2]: #todo
[Ecma262PullRequest]: #todo
[WebCrypto]: https://w3c.github.io/webcrypto/
[UUID]: https://github.com/tc39/proposal-uuid