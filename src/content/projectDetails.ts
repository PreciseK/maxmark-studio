export type ProjectDetail = {
  summary: string;
  challenge: string;
  approach: string;
  services: string[];
  galleryTimes: number[];
};

export const projectDetails: Record<string, ProjectDetail> = {
  "ritual-of-motion": {
    summary:
      "A kinetic brand film that turns everyday movement into ritual, built around rhythm, repetition, and a distinctly African visual pulse.",
    challenge:
      "Create a movement story that feels immediate and culturally specific while holding the clarity and confidence of a global sports campaign.",
    approach:
      "We treated motion as the visual system: energetic performances, graphic transitions, and tightly controlled edits carry the film from first beat to final frame.",
    services: ["Creative direction", "AI production", "Post-production"],
    galleryTimes: [0, 1, 2, 3, 4],
  },
  "the-last-frontier": {
    summary:
      "An original narrative study of distance, belonging, and the moment a familiar world begins to change.",
    challenge:
      "Build a story world with emotional scale and cinematic atmosphere, without losing the intimacy at the centre of the film.",
    approach:
      "Quiet performances, patient framing, and a restrained visual language let the environment carry as much meaning as the characters.",
    services: ["Narrative development", "Direction", "Finishing"],
    galleryTimes: [0, 1, 2, 3, 4],
  },
  frequency: {
    summary:
      "A music visual shaped by signal, performance, and the energy exchanged between artist and audience.",
    challenge:
      "Translate the force of a live performance into a visual language that feels authored, restless, and replayable.",
    approach:
      "We layered performance photography with signal-driven treatments and fast editorial shifts, keeping the artist at the centre of every experiment.",
    services: ["Visual concept", "Performance direction", "VFX"],
    galleryTimes: [0, 1, 2, 3, 4],
  },
  "heritage-drop": {
    summary:
      "A culture-led brand story connecting legacy with a new generation moving on its own terms.",
    challenge:
      "Make heritage feel alive rather than archival, balancing a familiar brand world with a contemporary African point of view.",
    approach:
      "Portraiture, material detail, and confident pacing create a film where legacy becomes something worn, shared, and remade in the present.",
    services: ["Campaign concept", "Production", "Editorial"],
    galleryTimes: [0, 1, 2, 3, 4],
  },
  isoka: {
    summary:
      "A compact narrative experiment about identity, courage, and the choices that define a turning point.",
    challenge:
      "Establish character, stakes, and a complete emotional arc inside a deliberately concise format.",
    approach:
      "Every image advances the story. Focused blocking, expressive close-ups, and a spare soundscape keep the world intimate and charged.",
    services: ["Original concept", "Direction", "Post-production"],
    galleryTimes: [0, 1, 2, 3, 4],
  },
  "golden-hour": {
    summary:
      "A luminous music visual built around warmth, intimacy, and the confidence of a moment fully owned.",
    challenge:
      "Create an elevated performance world that feels polished without losing the ease and personality of the artist.",
    approach:
      "Warm light, close portraiture, and fluid camera movement turn a simple performance into a sequence of vivid, tactile moments.",
    services: ["Creative direction", "Production", "Colour and finish"],
    galleryTimes: [0, 1, 2, 3, 4],
  },
};
