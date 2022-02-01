<template>
  <div>
    <ul id="todo-list">
      <li v-for="(country, index) in addedCountries" :key="index">
        <button
          class="complete"
          v-bind:class="country.visisted ? 'yes' : 'no'"
          v-on:click="$emit('toggle-visisted', index)"
        ></button>
        <label>{{ country.name }}</label>
        <button
          class="destroy"
          v-on:click="$emit('remove-country', index)"
        ></button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AddedCountriesComponent",
  props: {
    addedCountries: Array,
  },
};
</script>
