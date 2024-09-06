<template>
  <v-form>
    <template v-for="field in formFields" :key="field.code">
      <v-autocomplete
        v-if="field.type == 'select'"
        v-model="formData[field.code]"
        v-show="!field.hidden"
        :label="field.label"
        :readonly="field.readonly === undefined ? false : field.readonly"
        :disabled="field.disabled === undefined ? false : field.disabled"
        :clearable="field.clearable === undefined ? false : field.clearable"
        :chips="field.chips === undefined ? false : field.chips"
        :multiple="field.multiple === undefined ? false : field.multiple"
        :items="getValues(field.items)"
        variant="outlined"
        density="compact"
        @focus="$emit('infocus', field.code)"
        @blur="$emit('inblur', field.code)"
      ></v-autocomplete>
      <v-checkbox
        v-else-if="field.type == 'checkbox'"
        v-model="formData[field.code]"
        v-show="!field.hidden"
        :label="field.label"
        :readonly="field.readonly === undefined ? false : field.readonly"
        :disabled="field.disabled === undefined ? false : field.disabled"
        variant="outlined"
        density="compact"
      ></v-checkbox>
      <v-radio-group
        v-else-if="field.type == 'radio'"
        v-show="!field.hidden"
        v-model="formData[field.code]"
        :inline="field.inline === undefined ? true : field.inline"
        variant="outlined"
        density="compact"
      >
        <v-radio
          v-for="item in getValues(field.items)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></v-radio>
      </v-radio-group>
      <v-range-slider
        v-else-if="field.type == 'range-slider'"
        v-show="!field.hidden"
        v-model="formData[field.code]"
        :strict="field.strict === undefined ? true : field.strict"
        :readonly="field.readonly === undefined ? false : field.readonly"
        :disabled="field.disabled === undefined ? false : field.disabled"
        :direction="
          field.direction === undefined ? 'vertical' : field.direction
        "
        :max="field.max ? field.max : 100"
        :min="field.min ? field.min : 0"
        :step="field.step ? field.step : 1"
        variant="outlined"
        density="compact"
      ></v-range-slider>
      <v-textarea
        v-else-if="field.type == 'textarea'"
        v-show="!field.hidden"
        v-model="formData[field.code]"
        :label="field.label"
        :readonly="field.readonly === undefined ? false : field.readonly"
        :disabled="field.disabled === undefined ? false : field.disabled"
        :clearable="field.clearable === undefined ? false : field.clearable"
        :suffix="field.suffix"
        :prepend-inner-icon="field.prepend"
        :append-inner-icon="field.append"
        row-height="20"
        :rows="2"
        variant="outlined"
        density="compact"
        @focus="$emit('infocus', field.code)"
        @blur="$emit('inblur', field.code)"
      ></v-textarea>
      <template v-else-if="field.type == 'slot'">
        <slot :name="field.code" :formData="formData" :field="field"></slot>
      </template>
      <template v-else-if="field.type == 'color'">
        <v-text-field
          v-show="!field.hidden"
          v-model="formData[field.code]"
          :label="field.label"
          :readonly="field.readonly === undefined ? false : field.readonly"
          :disabled="field.disabled === undefined ? false : field.disabled"
          :clearable="field.clearable === undefined ? false : field.clearable"
          variant="outlined"
          density="compact"
        >
          <template #append-inner>
            <v-btn
              size="small"
              density="compact"
              icon="mdi-palette"
              :color="formData[field.code]"
              @click="
                () => {
                  $emit('infocus', field.code);
                  dialogVisiables[field.code] = true;
                }
              "
            ></v-btn>
          </template>
        </v-text-field>
        <v-dialog
          v-model="dialogVisiables[field.code]"
          :key="field.code"
          width="auto"
          persistent
        >
          <template v-slot:default>
            <v-card prepend-icon="mdi-update" title="颜色选择">
              <template v-slot:text>
                <v-color-picker
                  class="w-100"
                  :key="field.code"
                  show-swatches
                  v-model="formData[field.code]"
                ></v-color-picker>
              </template>
              <template v-slot:actions>
                <v-btn
                  class="ms-auto"
                  text="确定"
                  @click="
                    () => {
                      $emit('inblur', field.code);
                      dialogVisiables[field.code] = false;
                    }
                  "
                ></v-btn>
              </template>
            </v-card>
          </template>
        </v-dialog>
      </template>
      <v-text-field
        v-else-if="field.type == 'number'"
        v-show="!field.hidden"
        v-model="formData[field.code]"
        :label="field.label"
        :readonly="field.readonly === undefined ? false : field.readonly"
        :disabled="field.disabled === undefined ? false : field.disabled"
        :clearable="field.clearable === undefined ? false : field.clearable"
        :suffix="field.suffix"
        prepend-inner-icon="mdi-minus"
        append-inner-icon="mdi-plus"
        @click:prepend-inner="formData[field.code]--"
        @click:append-inner="formData[field.code]++"
        variant="outlined"
        density="compact"
        @focus="$emit('infocus', field.code)"
        @blur="$emit('inblur', field.code)"
        @keydown.down="formData[field.code]--"
        @keydown.up="formData[field.code]++"
      ></v-text-field>
      <v-text-field
        v-else
        v-show="!field.hidden"
        v-model="formData[field.code]"
        :label="field.label"
        :readonly="field.readonly === undefined ? false : field.readonly"
        :disabled="field.disabled === undefined ? false : field.disabled"
        :clearable="field.clearable === undefined ? false : field.clearable"
        :suffix="field.suffix"
        :prepend-inner-icon="field.prepend"
        :append-inner-icon="field.append"
        @click:prepend-inner="($event: any)=> field.prependEvent && field.prependEvent( formData)"
        @click:append-inner="($event: any)=> field.appendEvent && field.appendEvent( formData)"
        variant="outlined"
        density="compact"
        @focus="$emit('infocus', field.code)"
        @blur="$emit('inblur', field.code)"
      ></v-text-field>
    </template>
  </v-form>
</template>

<script lang="ts" setup>
import type { Enumish, FormField } from "@/workshop";

const { formData, formFields }: { formData: any; formFields: FormField[] } =
  defineProps(["formData", "formFields"]) as any;

defineEmits(["infocus", "inblur"]);

const dialogVisiables = reactive(
  formFields
    .filter((f) => f.type == "color")
    .reduce((prev: any, cur) => {
      prev[cur.code] = ref(false);
      return prev;
    }, {})
);

function getValues(items: Enumish | undefined): any[] {
  return items ? Object.values(items) : [];
}
</script>

<style lang="scss">
.main-aside {
  width: 300px !important;
  height: 100%;
}
</style>
