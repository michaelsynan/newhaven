<script
  setup
  lang="ts"
>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { events as allEvents } from '~/data/events';

const showHeading = ref(false);
const headingRef = ref(null);
const showDesc = ref(false);
const descRef = ref(null);
const getInvolvedRef = ref(null);

// Show only currently featured events on the homepage.
const events = allEvents.filter(event => event.featured);

const activeIndex = ref(0);
let rotationTimer: ReturnType<typeof setInterval> | undefined;

const activeEvent = computed(() => events[activeIndex.value]);


const goTo = (index: number) => {
  if (!events.length) return;
  activeIndex.value = ((index % events.length) + events.length) % events.length;
};

const next = () => {
  goTo(activeIndex.value + 1);
};

const prev = () => {
  goTo(activeIndex.value - 1);
};


onMounted(() => {
  if (events.length <= 1) return;
  rotationTimer = setInterval(next, 6000);
});

onBeforeUnmount(() => {
  if (rotationTimer) clearInterval(rotationTimer);
});
</script>

<template>
  <UContainer class="py-40 relative z-[100] gap-20">
    <div class="flex flex-col md:flex-row gap-12 items-stretch overflow-visible">
      <!-- Left: Heading and Description -->
      <div class="flex-1 flex flex-col justify-start md:items-start items-center gap-4 relative overflow-visible">
        <h2 class="text-left w-full text-4xl animate-fade-in-up">Find Your Home<br class="md:hidden"> <span
            class="text-secondary"
          >With
            Us</span>.</h2>
        <div class="text-left max-w-xl text-xl animate-fade-in-up">
          New Haven Ministries is more than a church—we're a family united by faith, committed to growing together and
          making a difference in our community and beyond.<br />
          <div class="mt-4 text-base text-gray-300 space-y-1">
            <div>
              <span class="text-gray-200 font-medium">Sunday Service</span>
              <span class="text-gray-400"> — Every Sunday • 10:00 AM</span>
            </div>
            <div>
              <span class="text-gray-200 font-medium">Bible Study</span>
              <span class="text-gray-400"> — Every Wednesday • 7:00 PM</span>
            </div>
          </div>
        </div>
        <!-- Blob directly under text -->
        <svg
          class="absolute -top-16 right-[30%] w-[32rem] h-[18rem] opacity-40 blur-3xl z-0 pointer-events-none"
          viewBox="0 0 600 400"
          fill="none"
        >
          <ellipse
            cx="300"
            cy="200"
            rx="220"
            ry="110"
            fill="#0096bb"
            fill-opacity="0.5"
          />
        </svg>
        <NuxtLink
          to="/Events"
          class="bg-primary/10 px-2 border-dotted mr-auto flex flex-row items-end gap-1 self-center md:self-start text-primary hover:text-secondary transition-colors cursor-pointer z-10 font-mono mt-4 hover:bg-primary/20 hover:shadow-md hover:-translate-y-0.5 transform hover:border-secondary/50 border border-transparent animate-fade-in-up"
        >
          <span>See All Events</span>
          <UIcon
            name="i-mdi-arrow-top-right"
            class="text-lg mb-1.5"
          />
        </NuxtLink>
      </div>
      <!-- Right: Event Cards stacked vertically -->
      <div class="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto">
        <div
          class="w-full bg-gradient-to-r from-primary/20 to-primary/10 border border-gray-800 px-6 py-4 flex items-center justify-between"
        >
          <h3 class="text-2xl md:text-3xl font-bold text-white">What's Happening?</h3>
          <UIcon
            name="i-mdi-calendar-month"
            class="text-3xl text-primary"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-if="activeEvent"
            class="md:col-span-2"
          >
            <div class="w-full relative">
              <button
                v-if="events.length > 1"
                type="button"
                class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                aria-label="Previous event"
                @click="prev"
              >
                <UIcon name="i-mdi-chevron-left" class="text-2xl" />
              </button>
              <button
                v-if="events.length > 1"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                aria-label="Next event"
                @click="next"
              >
                <UIcon name="i-mdi-chevron-right" class="text-2xl" />
              </button>
              <NuxtLink
                :to="`/Events/${activeEvent.id}`"
                class="block w-full"
                aria-label="View event details"
              >
                <Transition
                  name="fade"
                  mode="out-in"
                >
                  <img
                    :key="activeEvent.id"
                    :src="activeEvent.image || '/placeholder-event.jpg'"
                    :alt="activeEvent.title"
                    class="w-full h-auto max-h-[70vh] object-contain"
                    @error="(e) => (e.target as HTMLImageElement).src = '/placeholder-event.jpg'"
                  />
                </Transition>
              </NuxtLink>
            </div>

            <div
              v-if="events.length > 1"
              class="flex items-center justify-center gap-2 mt-3"
            >
              <button
                v-for="(event, idx) in events"
                :key="event.id"
                type="button"
                class="h-2.5 w-2.5 rounded-full transition-colors cursor-pointer"
                :class="idx === activeIndex
                  ? 'bg-gray-200'
                  : 'bg-gray-600/60 hover:bg-gray-500/80'"
                :aria-label="`Go to event ${idx + 1}`"
                @click="goTo(idx)"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
