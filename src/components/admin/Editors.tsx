"use client";

import {
  Field,
  TextInput,
  NumberInput,
  TextArea,
  Select,
  Toggle,
  ListInput,
  LinesInput,
  Card,
  Button,
  RowControls,
  listOps,
} from "./Fields";
import {
  PROJECT_STATUSES,
  SOCIAL_KEYS,
  type SiteContent,
  type Project,
  type Stat,
  type SkillCategory,
  type ExperienceEntry,
  type Social,
} from "@/lib/data";

/**
 * Section editors for the admin panel.
 *
 * Every editor takes the whole content object and a setter, and returns a new
 * object — no mutation, so React always sees a changed reference and the
 * unsaved-changes indicator stays honest.
 */

type EditorProps = {
  content: SiteContent;
  update: (patch: Partial<SiteContent>) => void;
};

/* -------------------------------------------------------------------------- */
/* Site                                                                        */
/* -------------------------------------------------------------------------- */

export function SiteEditor({ content, update }: EditorProps) {
  const s = content.site;
  const set = (patch: Partial<typeof s>) => update({ site: { ...s, ...patch } });

  return (
    <div className="space-y-5">
      <Card title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Site name" hint="Browser tab title and social previews.">
            <TextInput value={s.siteName} onChange={(v) => set({ siteName: v })} />
          </Field>
          <Field label="Your name" hint="Shown in the navbar and footer.">
            <TextInput value={s.name} onChange={(v) => set({ name: v })} />
          </Field>
          <Field label="Initials" hint="The monogram mark. 1–2 characters.">
            <TextInput value={s.initials} onChange={(v) => set({ initials: v })} />
          </Field>
          <Field label="Role">
            <TextInput value={s.role} onChange={(v) => set({ role: v })} />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={s.email} onChange={(v) => set({ email: v })} />
          </Field>
          <Field label="Location">
            <TextInput value={s.location} onChange={(v) => set({ location: v })} />
          </Field>
        </div>
      </Card>

      <Card title="Hero">
        <div className="space-y-4">
          <Field label="Headline" hint="Animates in word by word.">
            <TextArea rows={2} value={s.heroHeadline} onChange={(v) => set({ heroHeadline: v })} />
          </Field>
          <Field
            label="Dimmed words"
            hint="Comma separated. These words render grey instead of gradient — must match the headline exactly, including case."
          >
            <ListInput value={s.heroDimWords} onChange={(v) => set({ heroDimWords: v })} />
          </Field>
          <Field label="Intro" hint={`Rendered after "I'm ${s.name.split(" ")[0]} — ".`}>
            <TextArea rows={3} value={s.heroIntro} onChange={(v) => set({ heroIntro: v })} />
          </Field>
        </div>
      </Card>

      <Card title="Availability">
        <div className="space-y-4">
          <Toggle
            checked={s.available}
            onChange={(v) => set({ available: v })}
            label="Open to new work"
          />
          <Field label="Availability label" hint="The pill above the headline.">
            <TextInput
              value={s.availabilityLabel}
              onChange={(v) => set({ availabilityLabel: v })}
            />
          </Field>
        </div>
      </Card>

      <Card title="Search & social">
        <div className="space-y-4">
          <Field label="Description" hint="Meta description and social preview text.">
            <TextArea rows={3} value={s.description} onChange={(v) => set({ description: v })} />
          </Field>
          <Field label="Tagline">
            <TextInput value={s.tagline} onChange={(v) => set({ tagline: v })} />
          </Field>
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* About + stats                                                               */
/* -------------------------------------------------------------------------- */

export function AboutEditor({ content, update }: EditorProps) {
  const a = content.about;
  const set = (patch: Partial<typeof a>) => update({ about: { ...a, ...patch } });

  const setStat = (i: number, next: Stat) =>
    update({ stats: listOps.update(content.stats, i, next) });

  return (
    <div className="space-y-5">
      <Card title="About">
        <div className="space-y-4">
          <Field label="Heading">
            <TextArea rows={2} value={a.heading} onChange={(v) => set({ heading: v })} />
          </Field>
          <Field label="Paragraphs" hint="One paragraph per line.">
            <LinesInput rows={8} value={a.paragraphs} onChange={(v) => set({ paragraphs: v })} />
          </Field>
          <Field label="Currently" hint="The 'Now' line on the profile card.">
            <TextInput value={a.nowPlaying} onChange={(v) => set({ nowPlaying: v })} />
          </Field>
        </div>
      </Card>

      <Card
        title="Stats"
        actions={
          <Button
            onClick={() =>
              update({
                stats: [...content.stats, { value: 0, suffix: "+", label: "New stat", hint: "" }],
              })
            }
          >
            + Add
          </Button>
        }
      >
        <div className="space-y-3">
          {content.stats.map((stat, i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[0.6875rem] text-faint">Stat {i + 1}</span>
                <RowControls
                  isFirst={i === 0}
                  isLast={i === content.stats.length - 1}
                  onUp={() => update({ stats: listOps.move(content.stats, i, -1) })}
                  onDown={() => update({ stats: listOps.move(content.stats, i, 1) })}
                  onRemove={() => update({ stats: listOps.remove(content.stats, i) })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <Field label="Value">
                  <NumberInput
                    value={stat.value}
                    step={0.1}
                    onChange={(v) => setStat(i, { ...stat, value: v })}
                  />
                </Field>
                <Field label="Suffix">
                  <TextInput value={stat.suffix} onChange={(v) => setStat(i, { ...stat, suffix: v })} />
                </Field>
                <Field label="Label">
                  <TextInput value={stat.label} onChange={(v) => setStat(i, { ...stat, label: v })} />
                </Field>
                <Field label="Hint">
                  <TextInput value={stat.hint} onChange={(v) => setStat(i, { ...stat, hint: v })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

const blankProject = (): Project => ({
  slug: `project-${Date.now()}`,
  name: "New project",
  summary: "",
  detail: "",
  year: String(new Date().getFullYear()),
  status: "Live",
  tech: [],
  cover: "/projects/nebula.svg",
  demo: "",
  source: "",
  featured: false,
  metrics: [],
});

export function ProjectsEditor({ content, update }: EditorProps) {
  const setProject = (i: number, next: Project) =>
    update({ projects: listOps.update(content.projects, i, next) });

  /** Featured is exclusive — one large card, so selecting one clears the rest. */
  const setFeatured = (i: number) =>
    update({
      projects: content.projects.map((p, idx) => ({ ...p, featured: idx === i })),
    });

  const covers = [
    "/projects/nebula.svg",
    "/projects/voidrunner.svg",
    "/projects/prism.svg",
    "/projects/sentinel.svg",
    "/projects/halcyon.svg",
    "/projects/atlas.svg",
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[0.8125rem] text-muted">
          {content.projects.length} project{content.projects.length === 1 ? "" : "s"}. The
          featured one gets the large layout at the top.
        </p>
        <Button
          variant="primary"
          onClick={() => update({ projects: [...content.projects, blankProject()] })}
        >
          + Add project
        </Button>
      </div>

      {content.projects.map((p, i) => (
        <Card key={p.slug + i}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-[0.9375rem] font-semibold text-bright">
                {p.name || "Untitled"}
              </h3>
              {p.featured && (
                <span className="rounded-full bg-bright px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-void">
                  Featured
                </span>
              )}
            </div>
            <RowControls
              isFirst={i === 0}
              isLast={i === content.projects.length - 1}
              onUp={() => update({ projects: listOps.move(content.projects, i, -1) })}
              onDown={() => update({ projects: listOps.move(content.projects, i, 1) })}
              onRemove={() => update({ projects: listOps.remove(content.projects, i) })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <TextInput value={p.name} onChange={(v) => setProject(i, { ...p, name: v })} />
            </Field>
            <Field label="Slug" hint="Must be unique.">
              <TextInput value={p.slug} onChange={(v) => setProject(i, { ...p, slug: v })} />
            </Field>
            <Field label="Year">
              <TextInput value={p.year} onChange={(v) => setProject(i, { ...p, year: v })} />
            </Field>
            <Field label="Status">
              <Select
                value={p.status}
                options={PROJECT_STATUSES}
                onChange={(v) => setProject(i, { ...p, status: v })}
              />
            </Field>
          </div>

          <div className="mt-4 space-y-4">
            <Field label="Summary" hint="One line, shown on the card.">
              <TextArea rows={2} value={p.summary} onChange={(v) => setProject(i, { ...p, summary: v })} />
            </Field>

            {p.featured && (
              <Field label="Detail" hint="Longer copy, featured layout only.">
                <TextArea
                  rows={4}
                  value={p.detail ?? ""}
                  onChange={(v) => setProject(i, { ...p, detail: v })}
                />
              </Field>
            )}

            <Field label="Technologies" hint="Comma separated.">
              <ListInput value={p.tech} onChange={(v) => setProject(i, { ...p, tech: v })} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Live demo URL" hint="Leave blank to hide the button.">
                <TextInput value={p.demo ?? ""} onChange={(v) => setProject(i, { ...p, demo: v })} />
              </Field>
              <Field label="Source URL" hint="Leave blank to hide the button.">
                <TextInput value={p.source ?? ""} onChange={(v) => setProject(i, { ...p, source: v })} />
              </Field>
            </div>

            <Field
              label="Cover image"
              hint="Pick bundled artwork, or type a path to your own file in public/."
            >
              <div className="space-y-3">
                <TextInput value={p.cover} onChange={(v) => setProject(i, { ...p, cover: v })} />
                <div className="flex flex-wrap gap-2">
                  {covers.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setProject(i, { ...p, cover: c })}
                      className={
                        "h-12 w-20 overflow-hidden rounded-lg border transition-colors " +
                        (p.cover === c
                          ? "border-white/60"
                          : "border-white/10 hover:border-white/30")
                      }
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Field>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant={p.featured ? "primary" : "secondary"}
                onClick={() => setFeatured(i)}
              >
                {p.featured ? "★ Featured" : "Make featured"}
              </Button>
            </div>

            {p.featured && (
              <div className="rounded-xl border border-white/[0.07] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-dim">
                    Metrics
                  </span>
                  <Button
                    onClick={() =>
                      setProject(i, {
                        ...p,
                        metrics: [...(p.metrics ?? []), { value: "", label: "" }],
                      })
                    }
                  >
                    + Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {(p.metrics ?? []).map((m, mi) => (
                    <div key={mi} className="flex items-end gap-3">
                      <Field label="Value" className="w-28">
                        <TextInput
                          value={m.value}
                          onChange={(v) =>
                            setProject(i, {
                              ...p,
                              metrics: listOps.update(p.metrics ?? [], mi, { ...m, value: v }),
                            })
                          }
                        />
                      </Field>
                      <Field label="Label" className="flex-1">
                        <TextInput
                          value={m.label}
                          onChange={(v) =>
                            setProject(i, {
                              ...p,
                              metrics: listOps.update(p.metrics ?? [], mi, { ...m, label: v }),
                            })
                          }
                        />
                      </Field>
                      <button
                        type="button"
                        onClick={() =>
                          setProject(i, { ...p, metrics: listOps.remove(p.metrics ?? [], mi) })
                        }
                        className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-dim hover:border-white/30 hover:text-bright"
                        aria-label="Remove metric"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Skills                                                                      */
/* -------------------------------------------------------------------------- */

export function SkillsEditor({ content, update }: EditorProps) {
  const setCat = (i: number, next: SkillCategory) =>
    update({ skillCategories: listOps.update(content.skillCategories, i, next) });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[0.8125rem] text-muted">
          Categories render as cards. Known ids get a matching icon: frontend, backend,
          games, design.
        </p>
        <Button
          variant="primary"
          onClick={() =>
            update({
              skillCategories: [
                ...content.skillCategories,
                { id: `cat-${Date.now()}`, title: "New category", blurb: "", skills: [] },
              ],
            })
          }
        >
          + Add category
        </Button>
      </div>

      {content.skillCategories.map((cat, i) => (
        <Card key={cat.id + i}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[0.9375rem] font-semibold text-bright">
              {cat.title || "Untitled"}
            </h3>
            <RowControls
              isFirst={i === 0}
              isLast={i === content.skillCategories.length - 1}
              onUp={() => update({ skillCategories: listOps.move(content.skillCategories, i, -1) })}
              onDown={() => update({ skillCategories: listOps.move(content.skillCategories, i, 1) })}
              onRemove={() => update({ skillCategories: listOps.remove(content.skillCategories, i) })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Title">
              <TextInput value={cat.title} onChange={(v) => setCat(i, { ...cat, title: v })} />
            </Field>
            <Field label="Icon id" hint="frontend / backend / games / design">
              <TextInput value={cat.id} onChange={(v) => setCat(i, { ...cat, id: v })} />
            </Field>
            <Field label="Blurb">
              <TextInput value={cat.blurb} onChange={(v) => setCat(i, { ...cat, blurb: v })} />
            </Field>
          </div>

          <div className="mt-4 rounded-xl border border-white/[0.07] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-dim">Skills</span>
              <Button
                onClick={() =>
                  setCat(i, { ...cat, skills: [...cat.skills, { name: "", level: 80, note: "" }] })
                }
              >
                + Add
              </Button>
            </div>
            <div className="space-y-3">
              {cat.skills.map((sk, si) => (
                <div key={si} className="flex items-end gap-3">
                  <Field label="Name" className="flex-1">
                    <TextInput
                      value={sk.name}
                      onChange={(v) =>
                        setCat(i, { ...cat, skills: listOps.update(cat.skills, si, { ...sk, name: v }) })
                      }
                    />
                  </Field>
                  <Field label="Level %" className="w-24">
                    <NumberInput
                      value={sk.level}
                      min={0}
                      max={100}
                      onChange={(v) =>
                        setCat(i, {
                          ...cat,
                          skills: listOps.update(cat.skills, si, {
                            ...sk,
                            level: Math.max(0, Math.min(100, v)),
                          }),
                        })
                      }
                    />
                  </Field>
                  <Field label="Note" className="w-32">
                    <TextInput
                      value={sk.note ?? ""}
                      onChange={(v) =>
                        setCat(i, { ...cat, skills: listOps.update(cat.skills, si, { ...sk, note: v }) })
                      }
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => setCat(i, { ...cat, skills: listOps.remove(cat.skills, si) })}
                    className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-dim hover:border-white/30 hover:text-bright"
                    aria-label="Remove skill"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}

      <Card title="Scrolling ticker">
        <Field label="Items" hint="Comma separated. Loops beneath the skill cards.">
          <ListInput
            value={content.marqueeItems}
            onChange={(v) => update({ marqueeItems: v })}
          />
        </Field>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Experience                                                                  */
/* -------------------------------------------------------------------------- */

const blankRole = (): ExperienceEntry => ({
  period: `${new Date().getFullYear()} — Present`,
  role: "New role",
  org: "",
  location: "",
  description: "",
  highlights: [],
  current: false,
});

export function ExperienceEditor({ content, update }: EditorProps) {
  const setEntry = (i: number, next: ExperienceEntry) =>
    update({ experience: listOps.update(content.experience, i, next) });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-[0.8125rem] text-muted">
          Newest first — the timeline renders in this order.
        </p>
        <Button
          variant="primary"
          onClick={() => update({ experience: [...content.experience, blankRole()] })}
        >
          + Add role
        </Button>
      </div>

      {content.experience.map((e, i) => (
        <Card key={i}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[0.9375rem] font-semibold text-bright">
              {e.role || "Untitled"} {e.org && <span className="text-dim">· {e.org}</span>}
            </h3>
            <RowControls
              isFirst={i === 0}
              isLast={i === content.experience.length - 1}
              onUp={() => update({ experience: listOps.move(content.experience, i, -1) })}
              onDown={() => update({ experience: listOps.move(content.experience, i, 1) })}
              onRemove={() => update({ experience: listOps.remove(content.experience, i) })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role">
              <TextInput value={e.role} onChange={(v) => setEntry(i, { ...e, role: v })} />
            </Field>
            <Field label="Organisation">
              <TextInput value={e.org} onChange={(v) => setEntry(i, { ...e, org: v })} />
            </Field>
            <Field label="Period" hint="e.g. 2024 — Present">
              <TextInput value={e.period} onChange={(v) => setEntry(i, { ...e, period: v })} />
            </Field>
            <Field label="Location">
              <TextInput value={e.location} onChange={(v) => setEntry(i, { ...e, location: v })} />
            </Field>
          </div>

          <div className="mt-4 space-y-4">
            <Field label="Description">
              <TextArea rows={3} value={e.description} onChange={(v) => setEntry(i, { ...e, description: v })} />
            </Field>
            <Field label="Highlights" hint="One per line.">
              <LinesInput value={e.highlights} onChange={(v) => setEntry(i, { ...e, highlights: v })} />
            </Field>
            <Toggle
              checked={e.current ?? false}
              onChange={(v) => setEntry(i, { ...e, current: v })}
              label="Current role (pulsing marker + 'Current' badge)"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Contact + socials                                                           */
/* -------------------------------------------------------------------------- */

export function ContactEditor({ content, update }: EditorProps) {
  const c = content.contact;
  const set = (patch: Partial<typeof c>) => update({ contact: { ...c, ...patch } });

  const setSocial = (i: number, next: Social) =>
    update({ socials: listOps.update(content.socials, i, next) });

  return (
    <div className="space-y-5">
      <Card title="Contact section">
        <div className="space-y-4">
          <Field label="Heading">
            <TextArea rows={2} value={c.heading} onChange={(v) => set({ heading: v })} />
          </Field>
          <Field label="Blurb">
            <TextArea rows={3} value={c.blurb} onChange={(v) => set({ blurb: v })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Response time">
              <TextInput value={c.responseTime} onChange={(v) => set({ responseTime: v })} />
            </Field>
            <Field label="Closing line" hint="The large call-to-action at the bottom.">
              <TextInput value={c.closingLine} onChange={(v) => set({ closingLine: v })} />
            </Field>
          </div>
        </div>
      </Card>

      <Card
        title="Social links"
        actions={
          <Button
            onClick={() =>
              update({
                socials: [...content.socials, { key: "github", label: "", handle: "", href: "" }],
              })
            }
          >
            + Add
          </Button>
        }
      >
        <div className="space-y-3">
          {content.socials.map((so, i) => (
            <div key={i} className="rounded-xl border border-white/[0.07] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[0.6875rem] text-faint">{so.label || "Untitled"}</span>
                <RowControls
                  isFirst={i === 0}
                  isLast={i === content.socials.length - 1}
                  onUp={() => update({ socials: listOps.move(content.socials, i, -1) })}
                  onDown={() => update({ socials: listOps.move(content.socials, i, 1) })}
                  onRemove={() => update({ socials: listOps.remove(content.socials, i) })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-4">
                <Field label="Icon" hint="Which logo to draw.">
                  <Select
                    value={so.key}
                    options={SOCIAL_KEYS}
                    onChange={(v) => setSocial(i, { ...so, key: v })}
                  />
                </Field>
                <Field label="Label">
                  <TextInput value={so.label} onChange={(v) => setSocial(i, { ...so, label: v })} />
                </Field>
                <Field label="Handle">
                  <TextInput value={so.handle} onChange={(v) => setSocial(i, { ...so, handle: v })} />
                </Field>
                <Field label="URL">
                  <TextInput value={so.href} onChange={(v) => setSocial(i, { ...so, href: v })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
