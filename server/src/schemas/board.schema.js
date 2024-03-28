import { z } from 'zod';

export const createBoardSchema = z.object({
    board_name: z.string({
        required_error: 'Board name is required'
    }),
    background_value: z.string({
        required_error: 'Background is required'
    })
});