# Edge Definition

Edges are defined on the basis of the following:

- text
    in-link: multiple
    out-link: 1
    value-based-link: yes
- paragraph
    in-link: multiple
    out-link: 1
    value-based-link: not implemented
- check-boxes
    in-link: multiple
    out-link: 1
    value-based-link: not implemented
- multiple-choice
    in-link: multiple
    out-link: 1
    value-based-link: not implemented
- date
    in-link: multiple
    out-link: multiple
    value-based-link: yes
- drop-down
    in-link: multiple
    out-link: multiple
    value-bases-link: yes
- time
    in-link: multiple
    out-link: multiple
    value-based-link: yes
- number
    in-link: multiple
    out-link: multiple
    value-based-link: yes
- website
    in-link: multiple
    out-link: 1
    value-based-link: not implemented
- email
    in-link: multiple
    out-link: 1
    value-based-link: not implemented
- price
    in-link: multiple
    out-link: 1
    value-based-link: not implemented
- address
    in-link: multiple
    out-link: 1
    value-based-link: not implemented

# Specification and Encoding Protocol:

- Value Equal To Jumps
- Value Less than or Greater than Jumps

All the jumps on the basis of "values" of the response. That's how we're going to implement it internally - we check the value of response to find out which one is the next question.

We'll dynamically keep a track of previous question - not to be generated in advance.

The "logics" are serialized through following convention:

- Each field contains the `next` pointer.
- The `next` pointer defines the logical jumps on the basis of value.
- The serialized jump logics are defined with following keywords:
    1. Value Equals to:                  `ve`   [value, `field_id`]
    2. Value Greater than:               `vg`   [value, `field_id`]
    3. Value Greater than or Equals to:  `vge`  [value, `field_id`]
    4. Value Lesser than:                `vl`   [value, `field_id`]
    5. Value Lesser than or Equals to:   `vle`  [value, `field_id`]
    6. Value Between (Right Inclusive):  `vbr`  [value.l, value.r, `field_id`]
    7. Value Between (Left Inclusive):   `vbl`  [value.l, value.r, `field_id`]
    8. Value Between (Inclusive):        `vbi`  [value.l, value.r, `field_id`]
    9. Value Between (Exclusive):        `vbe`  [value.l, value.r, `field_id`]
   10. Any Answer (Mandatory jump):      `va`   `field_id`
- There may be multiple jump logics defined, however, there can only be one `Any Answer` jump definition.
- Keywords 1 through 9 are optional.
- Keywords 1 through 9 are defined as follows:
    - Since there can be multiple rules, they're a List of Rules.
    - Rules are expressed through the convention as defined above.
- Keyword Precedence is defined as follows:
    1. `vbi`
    2. `vbr`, `vbl`
    3. `vbe`
    4. `vle`, `vge`
    5. `vl`, `vg`
    6. `ve`
    7. `va`
- Conflicting rules are NOT needed to be handled. Precedence would take care of it.
- Conflicting rules which have equal precedence would be evaluated on the basis of first rule encountered.
- These rules are not inferred - These MUST be defined explicitly.
- Rule `va` CAN be empty (has to be defined nevertheless). In case no user input matches any rule (and, is correct syntactically), survey end would be called. Hence, Rule `va` SHOULD be defined wherever applicable.
