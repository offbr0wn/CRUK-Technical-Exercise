import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Button, TextField, Select } from "@cruk/cruk-react-components";
import { Dispatch, SetStateAction } from "react";
import { NasaSearchParams } from "../types";

const currentYear = new Date().getFullYear();

export const formSchema = z.object({
  keywords: z
    .string()
    .min(2, "keywords must have at least 2 characters.")
    .max(50, "keywords must have at most 50 characters."),
  mediaType: z.enum(["audio", "video", "image"], {
    errorMap: () => ({ message: "Please select a media type" }),
  }),
  yearStart: z
    .string()
    .superRefine((val, ctx) => {
      const year = Number(val);
      if (val === "") return;
      if (isNaN(year)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid number",
        });
      }
      if (year < 1900) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Year start must be after 1900.",
        });
      }
      if (year > currentYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Year start must not be in the future.",
        });
      }
    })
    .transform((val) => (val ? Number(val) : undefined))
    .optional(),
});

export type FormValues = z.infer<typeof formSchema>;

export const initialData = {
  keywords: "",
  mediaType: "" as "audio" | "video" | "image",
  yearStart: undefined,
} as FormValues;

export function Form({
  setValues,
}: {
  setValues: Dispatch<SetStateAction<NasaSearchParams | undefined>>;
}) {
  const formProps = useForm<FormValues>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    criteriaMode: "firstError",
    shouldFocusError: true,
    defaultValues: initialData,
    resolver: zodResolver(formSchema),
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = formProps;

  const onSubmit: SubmitHandler<FormValues> = async (data): Promise<void> => {
    setValues({
      ...data,
      yearStart: data.yearStart ?? 0,
    });
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* TODO update form elements */}
        <Box marginBottom="m">
          <Box marginBottom="m">
            <TextField
              {...register("keywords")}
              errorMessage={errors.keywords?.message}
              label="Keywords"
              required
            />
          </Box>

          <Box marginBottom="m">
            <Select
              {...register("mediaType")}
              errorMessage={errors.mediaType?.message}
              label="Media Type"
              required
            >
              <option disabled>--Please choose an option--</option>

              <option value="audio">Audio</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
            </Select>
          </Box>

          <Box marginBottom="m">
            <TextField
              {...register("yearStart")}
              errorMessage={errors.yearStart?.message}
              label="Year Start"
            />
          </Box>
        </Box>
        <Box marginBottom="m">
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </>
  );
}
