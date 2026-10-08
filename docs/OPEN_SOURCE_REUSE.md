# Open-Source Reuse Policy

## Purpose

Open-source work can accelerate LensPilot AI, but it must improve the product without misrepresenting authorship. Recruiters should be able to distinguish upstream inspiration, adapted components, and original LensPilot work.

## Reuse levels

### 1. Design reference

We study behavior, architecture, test strategy, or UX patterns and implement our own solution. Record the reference and the lesson learned. Do not claim the upstream implementation as ours.

### 2. Adapted source

We copy or substantially modify a compatible source file. Preserve the required copyright and license notice, identify the original file, and describe LensPilot-specific modifications.

### 3. Dependency

We install a published library and use its public API. Keep the dependency in the lockfile and comply with its license. Avoid copying its internal code into the repository.

### 4. Fork

We fork an entire project only when its product model and architecture are close enough that the fork history is useful. LensPilot currently does not use this approach because its coaching loop, EXIF reasoning, history profile, and learning plan are distinct.

## License rules

- Prefer permissive MIT, BSD, and Apache-2.0 sources.
- Preserve notices required by the upstream license.
- Review Apache-2.0 NOTICE and patent clauses when applicable.
- Do not import GPL or AGPL source into the MIT codebase without an explicit licensing decision.
- A public GitHub repository without a license is not automatically reusable.
- Images, icons, fonts, and sample photos need their own permission checks even when code is open source.

## Portfolio disclosure

Use language such as:

> I designed the LensPilot product flow and implemented its application-specific architecture. I reviewed permissively licensed open-source projects for upload, metadata, and AI UX patterns; references and any adapted source are disclosed in THIRD_PARTY_NOTICES.md.

Avoid language such as “built entirely from scratch” when external source has been adapted.

## Review checklist before importing code

1. Confirm the repository and specific file license.
2. Confirm the source solves the same technical problem.
3. Prefer a small isolated component over an entire repository.
4. Add tests that describe LensPilot's expected behavior.
5. Rename and reshape the module around LensPilot domain concepts.
6. Record the source, license, and changes.
7. Be able to explain the resulting code in an interview.

