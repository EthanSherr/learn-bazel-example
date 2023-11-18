# Cool!


## build
> bazel build ...

## 
> bazel test ...

## run
> bazel run projects/my_python_app



- [python py_binary, py_library, pip_parse](https://www.youtube.com/watch?v=qiZXFdd8OPo&list=PLdk2EmelRVLovmSToc_DK7F1DV_ZEljbx&index=2)
- [last lesson](https://www.youtube.com/watch?v=qiZXFdd8OPo&list=PLdk2EmelRVLovmSToc_DK7F1DV_ZEljbx&index=3)



## [10-29-2023] I've built rules_js js_binary, trying to figure out how to build js_run_binary
## [11-17-2023] i've got node-js-project running a binary but not yet npm modules

I'm stuck... I thought I should set it up like a pnpm-workspace just now, and i'm tyring to require("is-odd") in node-js-project/index.js and do a js_binary but when I build I see

```sh
DEBUG: /home/BOSDYN/esherr/.cache/bazel/_bazel_esherr/3ff4f22b3f0c3c12bce8ccbc59d740dc/external/aspect_rules_js/npm/private/npm_translate_lock_state.bzl:266:14: 
WARNING: Implicitly using .npmrc file `//:.npmrc`.
        Set the `npmrc` attribute of `npm_translate_lock(name = "npm")` to `//:.npmrc` suppress this warning.
ERROR: /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/projects/node-js-project/BUILD.bazel:4:22: no such target '//:.aspect_rules_js/node_modules/is-odd@3.0.1': target '.aspect_rules_js/node_modules/is-odd@3.0.1' not declared in package '' defined by /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/BUILD.bazel and referenced by '//projects/node-js-project:node_modules/is-odd'
ERROR: Analysis of target '//projects/node-js-project:applib' failed; build aborted: 
INFO: Elapsed time: 0.093s
INFO: 0 processes.
FAILED: Build did NOT complete successfully (2 packages loaded, 4 targets configured)
    currently loading: @go_sdk_toolchains//
```
trying to use :node_modules/is-odd as a dep of js_library... I'm sad


AH I resolved it... I needed to have a 
```py
load("@npm//:defs.bzl", "npm_link_all_packages")

npm_link_all_packages()
```
at the root.  This was an insanely useful read: 
[hackmd.io presentation on rules_js](https://hackmd.io/@aspect/rules_js?print-pdf#/)
[stack overflow answer overview by Toxaris](https://stackoverflow.com/questions/75445658/how-to-setup-a-bazel-workspace-with-rules-js-for-a-monorepo-with-multiple-pack)
x [docs](https://docs-legacy.aspect.build/aspect-build/rules_js/v1.0.0-rc.1/docs/npm_import-docgen.html)
[rules_nodejs readme.md](https://docs.aspect.build/rulesets/rules_nodejs)

I'm trying to figure out how to use "type": "module" ESM syntax in node-js-project/index.js
But do I really care?  I mean I'll be using typescript anyway.


## [2023-11-18]
[rules_ts docs](hthttps://docs.aspect.build/rulesets/aspect_rules_ts)
[rules_ts installation](https://github.com/aspect-build/rules_ts/releases)

### skipLibCheck, linked to tsconfig
```sh
######## Required Typecheck Performance Selection ########

TypeScript's type-checking exposes a flag `--skipLibCheck`:
https://www.typescriptlang.org/tsconfig#skipLibCheck

Using this flag saves substantial time during type-checking.
Rather than doing a full check of all d.ts files, TypeScript will only type-check the code you
specifically refer to in your app's source code.
We recommend this for most rules_ts users.

HOWEVER this performance improvement comes at the expense of type-system accuracy. 
For example, two packages could define two copies of the same type in an inconsistent way.
If you publish a library from your repository, your incorrect types may result in errors for your users.

You must choose exactly one of the following flags:

1. To choose the faster performance put this in /.bazelrc:

    # passes an argument `--skipLibCheck` to *every* spawn of tsc
    build --@aspect_rules_ts//ts:skipLibCheck=always
    fetch --@aspect_rules_ts//ts:skipLibCheck=always
    query --@aspect_rules_ts//ts:skipLibCheck=always

2. To choose more correct typechecks, put this in /.bazelrc:

    # honor the setting of `skipLibCheck` in the tsconfig.json file
    build --@aspect_rules_ts//ts:skipLibCheck=honor_tsconfig
    fetch --@aspect_rules_ts//ts:skipLibCheck=honor_tsconfig
    query --@aspect_rules_ts//ts:skipLibCheck=honor_tsconfig
```

I've opted for 2.


### need to pick a transpiler

```sh
esherr@laptop-esherr01:~/personal/learn-bazel/multi-language-repo$ bazel build ...
DEBUG: /home/BOSDYN/esherr/.cache/bazel/_bazel_esherr/3ff4f22b3f0c3c12bce8ccbc59d740dc/external/aspect_rules_js/npm/private/npm_translate_lock_state.bzl:266:14: 
WARNING: Implicitly using .npmrc file `//:.npmrc`.
        Set the `npmrc` attribute of `npm_translate_lock(name = "npm")` to `//:.npmrc` suppress this warning.
INFO: Build option --@aspect_rules_ts//ts:skipLibCheck has changed, discarding analysis cache.
ERROR: /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/projects/my-ts-project/BUILD.bazel:7:11: in ts_project rule //projects/my-ts-project:something_something: 
Traceback (most recent call last):
        File "/home/BOSDYN/esherr/.cache/bazel/_bazel_esherr/3ff4f22b3f0c3c12bce8ccbc59d740dc/external/aspect_rules_ts/ts/private/ts_project.bzl", line 230, column 21, in _ts_project_impl
                fail(transpiler_selection_required)
Error in fail: 
######## Required Transpiler Selection ########

You must select a transpiler for ts_project rules, which produces the .js outputs.

Please read https://docs.aspect.build/rules/aspect_rules_ts/docs/transpiler

##########################################################
ERROR: /home/BOSDYN/esherr/personal/learn-bazel/multi-language-repo/projects/my-ts-project/BUILD.bazel:7:11: Analysis of target '//projects/my-ts-project:something_something' failed
ERROR: Analysis of target '//projects/my-ts-project:something_something' failed; build aborted: 
INFO: Elapsed time: 0.478s
INFO: 0 processes.
FAILED: Build did NOT complete successfully (0 packages loaded, 11177 targets configured)
```

[transpiling typescript to javascript](https://docs.aspect.build/rulesets/aspect_rules_ts/docs/transpiler/)

```
The TypeScript compiler tsc can perform type-checking, transpilation to JavaScript, or both. Type-checking is typically slow, and is really only possible with TypeScript, not with alternative tools. Transpilation is mostly "erase the type syntax" and can be done well by a variety of tools.

ts_project allows us to split the work, with the following design goals:

The user should only need a single BUILD.bazel declaration: "these are my TypeScript sources and their dependencies".
Most developers have a working TypeScript Language Service in their editor, so they got type hinting before they ran bazel.
Development activities which rely only on runtime code, like running tests or manually verifying behavior in a devserver, should not need to wait on type-checking.
Type-checking still needs to be verified before checking in the code, but only needs to be as fast as a typical test.
Read more: https://blog.aspect.dev/typescript-speedup
```

all that was needed was including swc in the ts_project, and correctly linking the tsconfigs, then aligning some properties to match tsconfig settings.


more info
[aspect-rules-ts](https://docs.aspect.build/rulesets/aspect_rules_ts/docs/rules)


Finally, I just learned I could use a ts_project as a dependency for a js_binary rule, and run it after compilation.  FUCK YES.