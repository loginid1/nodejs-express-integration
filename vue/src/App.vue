<template>
  <div id="app">
    <div class="card m-lg-5">
      <div class="card-body">
        <form action="/validate" method="POST">
          <div class="row">
            <div class="col-lg-6">
              <div class="card m-lg-3 m-1">
                <h5 class="card-header">Create Transaction</h5>
                <div class="card-body">
                  <div v-for="(value, i) in form" :key="i" class="form-row mb-3">
                    <label :for="i">{{toLabel(i)}}</label>
                    <div class="input-group">
                      <div class="col-4">
                        <input
                          :value="i"
                          @change="onPropChange(i, $event.target.value)"
                          type="text"
                          class="form-control"
                          placeholder="Enter Field Name"
                          required
                        />
                      </div>
                      <div class="col">
                        <input
                          v-model="form[i]"
                          placeholder="Enter Value"
                          type="text"
                          :name="i"
                          class="form-control"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div class="form-row mt-4">
                    <button @click.prevent="addField" class="btn btn-primary">Add field</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="card m-lg-3 m-1">
                <div class="card-body">
                  <pre><code class="json" v-html="JSON.stringify(form, null, 4)"></code></pre>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="col">
              <button class="btn btn-primary confirm-btn" type="submit">Confirm (OIDC)</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="card m-lg-5">
      <div class="card-body">
        <div class="row">
          <div class="col">
            <input v-model="username" class="form-control" placeholder="username" />
          </div>
          <div class="col">
            <button
              class="btn btn-primary confirm-btn"
              @click.prevent="register"
            >Register (DirectWeb)</button>
          </div>
          <div class="col">
            <button
              class="btn btn-primary confirm-btn"
              data-toggle="modal"
              data-target="#tx-modal"
              @click.prevent="onClick"
            >Confirm (DirectWeb)</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade animate custom"
      data-backdrop="static"
      id="tx-modal"
      tabindex="-1"
      role="dialog"
    >
      <div ref="tx-modal" class="modal-dialog">
        <div class="modal-content animate-bottom rounded-0">
          <div class="modal-header text-center">
            <div class="row row-center">
              <div class="col" v-html="fingerprint"></div>
              <div class="col">
                <h4>Transaction Details</h4>
              </div>
            </div>
          </div>
          <div class="modal-body">
            <div class="content-list text-muted">
              <div class="tx-details">
                <h6 class="mb-2 text-muted text-center">{{ date }} {{ time }}</h6>
                <hr />
                <div class="row" v-for="(value, index) in form" v-bind:key="index">
                  <div class="col">{{ index }}:</div>
                  <div class="col">{{ value }}</div>
                </div>
              </div>
            </div>
          </div>
          <button
            hidden="true"
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            id="close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import _ from "lodash";
import LoginidApi from "./directweb";

export default {
  name: "App",
  data() {
    return {
      fingerprint: `<svg width="50px" height="50px" viewBox="0 0 1000 1000">
          <g class="svgWrapper">
            <defs>
              <filter id="glow">
                <feGaussianBlur
                  class="blur"
                  result="coloredBlur"
                  stdDeviation="4"
                ></feGaussianBlur>
                <feMerge>
                  <feMergeNode in="coloredBlur"></feMergeNode>
                  <feMergeNode in="coloredBlur"></feMergeNode>
                  <feMergeNode in="coloredBlur"></feMergeNode>
                  <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
              </filter>
            </defs>
            <g
              transform="translate(1.000000, 1.000000)"
              stroke="#89a8bd"
              stroke-width="5"
            >
              <path
                class="path1"
                style="
                  fill-opacity: 1;
                  fill: #ff0000;
                  stroke-width: 2;
                  stroke: #ff0000;
                  filter: url(#glow);
                "
                d="M636 938h-6q-92-24-158-90-38-38-65-103t-27-119q0-52 38-89t92-37 93 37 39 89q0 34 25 58t63 24 64-24 26-58q0-120-91-206t-219-86q-92 0-168 47t-114 125q-24 50-24 120 0 80 28 154 6 20-14 26t-26-12q-32-82-32-168 0-78 30-138 42-90 129-144t191-54q146 0 249 99t103 237q0 52-39 88t-93 36-92-36-38-88q0-34-26-59t-64-25-63 25-25 59q0 112 80 192 56 56 140 78 18 2 14 26-4 16-20 16zM530 626q0 74 55 128t137 54q4 0 18-2t23-2 18 3 11 13q4 22-18 26-24 4-52 4-80 0-132-38-102-70-102-186 0-22 22-22 20 0 20 22zM416 930q-8 0-14-6-54-54-86-114-46-80-46-184 0-94 71-162t171-68 171 68 71 162q0 20-22 20t-22-20q0-78-58-133t-140-55-140 55-58 133q0 96 38 164 26 46 80 104 16 14 0 30-6 6-16 6zM150 414q-22 0-22-20 0-4 4-12 64-92 160-140 100-52 220-52t220 52q98 48 160 138 4 8 4 12 0 14-16 20t-24-8q-60-82-144-124-92-46-200-47t-200 47q-90 46-146 126-6 8-16 8zM760 190q-8 0-10-2-118-60-238-60-130 0-238 60-10 6-20 0t-10-18q0-14 10-20 116-64 258-64 130 0 258 64 18 10 8 28-8 12-18 12z"
                id="Stroke-1"
              >
                <animate
                  attributeName="opacity"
                  dur="2s"
                  values="0.1;1;0.1"
                  repeatCount="indefinite"
                  begin="0.2"
                ></animate>
              </path>
            </g>
          </g>
        </svg>`,
      form: {
        field_1: "",
      },
      tx: {},
      date: null,
      time: null,
      username: "",
    };
  },
  created() {
    const date = new Date();
    this.date = date.toDateString();
    this.time = date.toLocaleTimeString();
  },
  methods: {
    toLabel(value) {
      return _.startCase(value);
    },
    addField() {
      const fieldName = `field_${Object.keys(this.form).length + 1}`;
      Vue.set(this.form, fieldName, "");
    },
    onPropChange(prop, newProp) {
      const value = this.form[prop];
      Vue.delete(this.form, prop);
      Vue.set(this.form, _.snakeCase(newProp), value);
    },
    async onClick() {
      try {
        LoginidApi.initializeWithBaseURL(
          "txoidcdemo.awstest.loginid.io",
          "https://poc1.awstest.loginid.io/api/native"
        );
        const createResponse = await LoginidApi.createTx(this.form, this.username);
        this.tx = createResponse.tx;
        const validateResponse = await LoginidApi.validateTx(createResponse, this.tx.id, this.username);
        window.location.href = `/tx-success?tx=${validateResponse.txId}`;
      } catch (err) {
        console.log(err);
      }
      this.closeModal();
    },
    async register() {
      try {
        LoginidApi.initializeWithBaseURL(
          "txoidcdemo.awstest.loginid.io",
          "https://poc1.awstest.loginid.io/api/native"
        );
        await LoginidApi.register(this.username);
      } catch (err) {
        console.log(err);
      }
    },
    closeModal() {
      document.getElementById("close").click();
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "./custom.scss";

.animate-bottom {
  position: relative;
  animation: animatebottom 0.4s;
}

@keyframes animatebottom {
  from {
    bottom: -300px;
    opacity: 0;
  }

  to {
    bottom: 0;
    opacity: 1;
  }
}

.row-center {
  display: block;
  width: 100%;
  margin: 0;
}

.modal.custom .modal-dialog {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10040;
  outline: none;
  overflow: hidden;
  margin-bottom: 0;
}

.modal-open .modal {
  overflow-y: hidden;
}
</style>
