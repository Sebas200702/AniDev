import { describe, it, expect  } from "vitest";
import { baseUrl } from "../../utils";
import type { Anime } from "../../types";



describe("Endpoint test get anime with slug",  () => {
    it("should return a anime", async () => {
        const anime :Anime | undefined = await fetch(`${baseUrl}/api/getAnime?slug=Spy%20x%20Family%20Part%202`).then(res => res.json()).then(data => data.anime)
        expect(anime).toBeDefined()
        expect(anime?.title).toBe('Spy x Family Part 2')
    })
});
