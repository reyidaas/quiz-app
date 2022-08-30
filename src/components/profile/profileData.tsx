import type { FC, ReactNode } from 'react';
import type { Prisma } from '@prisma/client';
import { VStack, Box, Text, Select, SelectField } from '@chakra-ui/react';

import Editable from '../../components/editable/editable';

type Profile = Prisma.ProfileGetPayload<{ include: { gender: true } }>;

interface Props {
  profile: Profile;
  isMe?: boolean;
}

interface SelectOption {
  optValue: string | number;
  label: string;
}

interface Field {
  name: keyof Profile;
  value: string | null;
  label: string;
  type: FieldType;
  options?: SelectOption[];
}

enum FieldType {
  Text,
  Select,
}

const ProfileData: FC<Props> = ({
  isMe,
  profile: { firstName, lastName, gender },
}) => {
  const fields: Field[] = [
    {
      name: 'firstName',
      value: firstName,
      label: 'First name',
      type: FieldType.Text,
    },
    {
      name: 'lastName',
      value: lastName,
      label: 'Last name',
      type: FieldType.Text,
    },
    {
      name: 'gender',
      value: gender?.type ?? null,
      label: 'Gender',
      type: FieldType.Select,
      options: [
        {
          optValue: 1,
          label: 'Male',
        },
        {
          optValue: 2,
          label: 'Female',
        },
      ],
    },
  ];

  const renderEditComponent = ({
    type,
    value,
    options,
  }: Pick<Field, 'type' | 'value' | 'options'>): ReactNode => {
    switch (type) {
      case FieldType.Text:
        return (
          <Editable
            defaultValue={value ?? 'None'}
            fontSize="lg"
            isPreviewFocusable={false}
            previewProps={{
              color: value ? 'white' : 'gray.500',
            }}
          />
        );
      case FieldType.Select:
        return (
          <Select placeholder="None" color={value ? 'white' : 'gray.500'}>
            {options?.map(({ optValue, label }) => (
              <option key={`select-${label}-${optValue}`} value={optValue}>
                {label}
              </option>
            ))}
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <VStack spacing={6} alignItems="stretch">
      {fields.map(({ name, label, type, value, options }) => (
        <Box key={`profile-${name}`}>
          <Text fontSize="xl" fontWeight={700}>
            {label}
          </Text>
          {isMe ? (
            renderEditComponent({ type, value, options })
          ) : (
            <Text color={value ? 'white' : 'gray.500'} fontSize="lg">
              {value ?? 'None'}
            </Text>
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default ProfileData;
