<template>
  <div class="input-component" v-click-outside="hideDropDown">
    <input
      id="new-todo"
      autocomplete="off"
      list="todo-list-autocomplete"
      placeholder="Country I want to visit"
      type="text"
      v-model="searchWord"
      v-on:keyup="handleInput"
    />
    <button
      class="add-button"
      :disabled="!enableAddButton"
      v-on:click="addCountry"
    >
      Add Country
    </button>
    <ul
      class="autocomplete-ul"
      v-show="showDropDown"
      @mouseleave="setFocus(null)"
    >
      <li
        class="autocomplete-li"
        :ref="'list-item' + index"
        :class="{ focus: index === focus }"
        :key="index"
        @mouseover="setFocus(index)"
        v-for="(country, index) in options"
        v-on:click="setCountry(country)"
      >
        {{ country }}
      </li>
    </ul>
  </div>
</template>

<script>
import constants from "@/utility/constants";

export default {
  name: "InputComponent",
  props: {
    addedCountries: Array,
    options: Array,
    wordCompleted: Boolean,
  },
  data() {
    return {
      focus: null,
      searchWord: "",
      showDropDown: false,
      wordAdded: false,
    };
  },

  methods: {
    addCountry() {
      this.$emit("add-country", this.searchWord);
      this.searchWord = "";
      this.wordAdded = false;
    },

    handleInput(event) {
      if (
        event.keyCode === constants.UP_ARROW_CODE ||
        event.keyCode === constants.DOWN_ARROW_CODE
      ) {
        if (this.focus === null) {
          this.focus = 0;
        } else if (
          event.keyCode === constants.UP_ARROW_CODE &&
          this.focus > 0
        ) {
          this.focus--;
        } else if (
          event.keyCode === constants.DOWN_ARROW_CODE &&
          this.focus < this.options.length - 1
        ) {
          this.focus++;
        }

        if (this.focus > 11) {
          // Fix for scrolling in search suggestion - 11 is calculated from height of search and list item
          this.$refs["list-item" + (this.focus - 11)][0].scrollIntoView();
        }
        this.searchWord = this.options[this.focus];
      } else {
        this.focus = null;
        this.showDropDown = true;
        this.$emit("search-word", this.searchWord);
      }
    },

    hideDropDown() {
      this.showDropDown = false;
    },

    setCountry(country) {
      this.searchWord = country;
      this.wordAdded = true;
      this.hideDropDown();
    },

    setFocus(index) {
      this.focus = index;
    },
  },
  computed: {
    enableAddButton() {
      return (
        (this.wordAdded || this.wordCompleted) &&
        this.addedCountries.findIndex(
          (country) =>
            country.name.toLowerCase() === this.searchWord.toLowerCase()
        ) === -1
      );
    },
  },
};
</script>
