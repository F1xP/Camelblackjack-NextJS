'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const updateProfile = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user?.email) return { message: null, error: `You must be signed in.` };
  const name: any = formData.get('name');
  const bio: any = formData.get('bio');
  if (!name) return { message: null, error: `Name field is required.` };

  const schema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long').max(39, 'Name cannot exceed 39 characters'),
    bio: z.string().max(128, 'Biography cannot exceed 128 characters'),
  });

  try {
    schema.parse({
      name: name,
      bio: bio,
    });
  } catch (e: any) {
    const validationError = fromZodError(e);
    return { message: null, error: validationError.message.split(' ').slice(2, -2).join(' ') + '.' || 'Unknown Error' };
  }

  try {
    await prisma.user.update({
      where: { email: user?.email },
      data: {
        name: name,
        bio: bio,
      },
    });
    revalidatePath('/settings');
    return { message: 'Profile Settings have been saved successfully.', error: null };
  } catch (e) {
    return { message: null, error: 'An error occurred while trying to save your profile settings. Please try again.' };
  }
};

export const resetProfile = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user?.email) return { message: null, error: `You must be signed in.` };
  const name: any = formData.get('name');
  if (!name) return { message: null, error: `Name field is required.` };

  const schema = z.object({
    name: z.string(),
  });

  try {
    schema.parse({
      name: name,
    });
  } catch (e: any) {
    const validationError = fromZodError(e);
    return { message: null, error: validationError.message.split(' ').slice(2, -2).join(' ') + '.' || 'Unknown Error' };
  }

  try {
    if (user?.name !== name) return { message: null, error: `The name you entered doesn't match your current name.` };
    await prisma.$transaction([
      prisma.user.update({
        where: { email: user?.email },
        data: {
          coins: 500,
          games: 0,
          wins: 0,
          loses: 0,
          pushes: 0,
        },
      }),
      prisma.game.deleteMany({
        where: { user_email: user?.email },
      }),
    ]);

    revalidatePath('/settings');
    return { message: 'Your account has been reset successfully.', error: null };
  } catch (e) {
    return {
      message: null,
      error: 'An error occurred while trying to reset your account. Please try again.',
    };
  }
};

export const deleteProfile = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user?.email) return { message: null, error: `You must be signed in.` };
  const name: any = formData.get('name');
  if (!name) return { message: null, error: `Name field is required.` };

  const schema = z.object({
    name: z.string(),
  });

  try {
    schema.parse({
      name: name,
    });
  } catch (e: any) {
    const validationError = fromZodError(e);
    return { message: null, error: validationError.message.split(' ').slice(2, -2).join(' ') + '.' || 'Unknown Error' };
  }

  try {
    if (user?.name !== name) return { message: null, error: `The name you entered doesn't match your current name.` };
    await prisma.user.delete({
      where: { email: user?.email },
    });
    revalidatePath('/settings');
    return { message: 'Your account has been deleted successfully.', error: null };
  } catch (e) {
    return {
      message: null,
      error: 'An error occurred while trying to delete your account. Please try again.',
    };
  }
};
