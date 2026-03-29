<script setup lang="ts">
/**
 * Vue SFC syntax stress-test for theme tuning.
 * script setup + TypeScript
 */

import {
  computed,
  ref,
  shallowRef,
  watch,
  watchEffect,
  onMounted,
  onUnmounted,
  defineProps,
  defineEmits,
  defineExpose,
  defineOptions,
  useTemplateRef,
  type Ref,
  type ComputedRef,
} from "vue";

defineOptions({
  name: "ThemeSyntaxDemo",
  inheritAttrs: false,
});

// Props & defaults
const props = withDefaults(
  defineProps<{
    title: string;
    count?: number;
    tags?: string[];
    variant?: "mint" | "gold" | "crimson";
  }>(),
  {
    count: 0,
    tags: () => ["theme", "lab"],
    variant: "mint",
  },
);

const emit = defineEmits<{
  (e: "update:count", value: number): void;
  (e: "select", id: string): void;
}>();

// Refs & computed
const localCount = ref(props.count);
const doubled: ComputedRef<number> = computed(() => localCount.value * 2);

const inputEl = useTemplateRef<HTMLInputElement>("inputEl");

// shallow / reactive patterns
const cache = shallowRef({ hits: 0 });

watch(
  () => props.count,
  (n) => {
    localCount.value = n ?? 0;
  },
);

watchEffect(() => {
  void (props.title && localCount.value);
});

function increment() {
  localCount.value += 1;
  emit("update:count", localCount.value);
}

function pick(id: string) {
  emit("select", id);
}

onMounted(() => {
  inputEl.value?.focus();
});

onUnmounted(() => {
  // teardown
});

defineExpose({
  increment,
  localCount,
});

// async component pattern (type-only)
type AsyncFactory = () => Promise<{ default: object }>;
const _lazy: AsyncFactory = () => import("./test-vue.vue");
</script>

<template>
  <!-- Template: directives, bindings, slots, v-* -->
  <section
    :id="`panel-${variant}`"
    class="syntax-demo"
    :class="[`syntax-demo--${variant}`, { 'is-active': localCount > 0 }]"
    :data-count="localCount"
    v-bind="$attrs"
  >
    <header>
      <h2>{{ title }}</h2>
      <p v-text="`Doubled: ${doubled}`" />
    </header>

    <input
      ref="inputEl"
      v-model.number="localCount"
      type="number"
      min="0"
      :aria-label="title"
      @keydown.enter.prevent="increment"
    />

    <button type="button" @click="increment">+1</button>
    <button type="button" @click.once="localCount = 0">Reset once</button>

    <ul>
      <li v-for="(tag, i) in tags" :key="tag" @click="pick(String(i))">
        <span v-if="tag.length">{{ tag }}</span>
        <span v-else-if="false" />
        <span v-else>(empty)</span>
      </li>
    </ul>

    <template v-for="n in 2" :key="n">
      <span v-show="n === 1">shown</span>
    </template>

    <slot name="actions" :count="localCount">
      <span class="fallback">Default slot content</span>
    </slot>

    <slot />

    <!-- v-html only for fixture; never with untrusted data in production -->
    <div class="raw" v-html="'<em>escaped-by-vue</em>'" />

    <Teleport to="body" disabled>
      <div class="teleport-stub" />
    </Teleport>

    <Suspense>
      <template #default>
        <span>default</span>
      </template>
      <template #fallback>
        <span>loading…</span>
      </template>
    </Suspense>
  </section>
</template>

<style scoped lang="scss">
@use "sass:color";

$mint: #96ccb9;

.syntax-demo {
  padding: 1rem;
  border: 1px solid color.adjust($mint, $alpha: -0.5);
  border-radius: 8px;

  &--mint {
    color: $mint;
  }

  &--gold {
    color: #e6c37e;
  }

  &--crimson {
    color: #92263f;
  }

  &.is-active {
    box-shadow: 0 0 0 2px $mint;
  }

  :deep(.raw em) {
    font-style: italic;
  }
}
</style>

<style lang="scss">
/* second style block: global */
.syntax-demo .fallback {
  opacity: 0.8;
}
</style>
