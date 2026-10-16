---
version: alpha
colors:
  background: "#f7f8f2"
  surface: "#fffefb"
  soft: "#eef1e7"
  ink: "#24382f"
  muted: "#5c685e"
  line: "#d7dfd2"
  primary: "#526b49"
  action: "#b96932"
typography:
  display:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "44px"
    lineHeight: "1.12"
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
    lineHeight: "1.55"
rounded:
  surface: "12px"
  control: "8px"
spacing:
  page: "22px"
  section: "30px"
  desktopGap: "44px"
components:
  button:
    height: "46px"
    rounded: "8px"
  navigation:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
  foundation:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.ink}"
  caption:
    textColor: "{colors.muted}"
  rule:
    backgroundColor: "{colors.line}"
  cookingAction:
    backgroundColor: "{colors.action}"
---

## Overview

Kome is a small cooking and strength reference for English-speaking adults, used with one hand in a kitchen or gym. The visual reference is a quiet everyday cooking notebook: useful quantities, breathing room and gently illustrated bowls. This is a product, not a marketing site. The Japanese food subject does not imply a Japanese locale or Japan-market data scope.

The signature is the paired dry-rice/raw-chicken foundation. The preview-only generated concept established the Today screen, composer and desktop split layout. Correct calculated values take precedence over illustrative numbers in that concept.

## Colors

The canonical runtime owner is the `:root` CSS custom properties in `index.html`; this document mirrors accepted values. Mapping: background → `--bg`, surface → `--surface`, soft → `--soft`, ink → `--ink`, muted → `--muted`, line → `--line`, primary → `--green`, action → `--orange`. Shared controls, rows, fields and navigation consume these variables. Action is used for cooking progression; green identifies selection. Neither represents moral food judgments.

Dark mode remaps these semantic roles under `html[data-theme=dark]`, retaining hierarchy. System theme is the default; a local explicit preference wins. Controls and text must remain readable in both themes.

## Typography

Georgia is reserved for headings and quantity displays; native system sans carries instructions and controls. Data uses tabular numerals. Display size drops to 32px on small phones. No downloaded fonts.

## Layout

22px phone gutters, 16px at 320px. Content has natural document scrolling. Today uses a main meal region and 300px summary column on desktop; mobile stacks the summary beneath the primary action. Main navigation moves to a safe-area-aware bottom bar below 820px. The composer uses independent vertical fields; reference data becomes per-food disclosures rather than a sideways-scrolling table.

## Elevation & Depth

Flat surfaces, fine borders and one soft tinted foundation band. Only transient notices and native dialogs use elevation. No nested card grids, dashboards, fake statistics or decorative gradients.

## Shapes

12px panels, 8px controls, fine outlined radio circles. Bowls and food symbols use small inline SVG at consistent stroke weight. The install icon is an optional separate asset; in-app visuals remain inline.

## Components

The canonical repeated owners in the inline app script are `foundation`, `recipes`, `mealTabs`, `daySummary`, `slider`, `macros`, `notify` and the native confirmation/copy dialogs. Form inputs and selects are intentionally native for iPhone familiarity, platform accessibility and keyboard behavior. Focus rings are visible; selected state has both a semantic attribute and visual treatment. Calculation changes preserve focused input geometry.

Routing, calculation and validation own one source each: `route`, `Kome` math and `Kome.validate`. Backups never supply renderable labels. A shared polite status announces results, debounced for sliders. Native dialogs trap focus and restore a logical origin. Destructive operations name the consequence and require a concrete confirmation.

## Do's and Don'ts

Use raw/dry weights, approximate labels and concrete ingredient instructions. Keep the tone friendly and practical. Show honest arithmetic before suggesting optional additions. Respect reduced motion and theme preferences. Keep every screen comfortable at 320px.

Avoid calorie shame, streaks, unsolicited schedules, stereotypes, external assets, remote data storage, elaborate frameworks and unnecessary form steps. Do not publish device data, private context or backups.
