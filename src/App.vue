<template>
  <div id="app">
    <section id="todoapp">
      <header id="header">
        <h1>Travel-List</h1>
        <InputComponent
          :options="filteredSearchResult"
          :added-countries="addedCountries"
          :word-completed="wordCompleted"
          v-on:add-country="addCountryList"
          v-on:search-word="searchRequest"
        />
      </header>
      <section id="main">
        <AddedCountriesComponent
          :added-countries="addedCountries"
          v-on:remove-country="deleteCountryList"
          v-on:toggle-visisted="toggleCountryList"
        />
      </section>
    </section>
  </div>
</template>

<script>
import constants from "@/utility/constants";
import AddedCountriesComponent from "./components/AddedCountriesComponent.vue";
import InputComponent from "./components/InputComponent.vue";
import axios from "axios";

export default {
  name: "App",
  components: {
    AddedCountriesComponent,
    InputComponent,
  },

  data() {
    return {
      addedCountries: [],
      cachedSearchResult: {},
      searchResult: [],
      wordCompleted: false,
    };
  },

  methods: {
    addCountryList(country) {
      this.wordCompleted = false;
      this.addedCountries.push({ name: country, visisted: false });
    },

    deleteCountryList(index) {
      this.$delete(this.addedCountries, index);
    },

    toggleCountryList(index) {
      var newCopy = Object.assign({}, this.addedCountries[index]);

      newCopy.visisted = !newCopy.visisted;
      this.$set(this.addedCountries, index, newCopy);
    },

    buildSuggestionsList(result, word) {
      var tempSearchResults = [];

      if (
        result.length === 1 &&
        result[0].name.common.toLowerCase() === word.toLowerCase()
      ) {
        this.wordCompleted = true;
      } else {
        result.forEach((countryHit) => {
          tempSearchResults.push(countryHit.name.common);
        });
        this.wordCompleted = false;
      }

      this.searchResult = tempSearchResults;
    },

    searchRequest(word) {
      if (this.cachedSearchResult[word]) {
        this.buildSuggestionsList(
          JSON.parse(this.cachedSearchResult[word]),
          word
        );
      } else {
        axios
          .get(`${constants.BASE_URL_API}${word}`)
          .then((response) => {
            this.cachedSearchResult[word] = JSON.stringify(response.data);
            this.buildSuggestionsList(response.data, word);
          })
          .catch((error) => {
            console.log(error);
            this.wordCompleted = false;
          });
      }
    },
  },

  computed: {
    filteredSearchResult() {
      if (this.addedCountries === null) {
        return this.searchResult;
      } else {
        return this.searchResult.filter((result) => {
          return !this.addedCountries.some((country) => {
            return country.name === result;
          });
        });
      }
    },
  },

  watch: {
    addedCountries: function (val) {
      localStorage.setItem("addedCountries", JSON.stringify(val));
    },
  },

  mounted() {
    var addedCountries = JSON.parse(
      window.localStorage.getItem("addedCountries")
    );

    this.addedCountries = addedCountries === null ? [] : addedCountries;
  },
};
</script>

<style lang="less" src="./assets/styling/_App.less"></style>
