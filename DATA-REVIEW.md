# Data review

Built from `Networking Community Groups.xlsx` (51 populated rows). Repeat listings between the category sections and the Women Focused section were merged into one entry each, leaving 40 groups. Categories, fees, and joining details come straight from the sheet; nothing was inferred.

## Needs a decision

1. **Unnamed row under Comms / Marketing.** A row with only the URL `https://www.comnetwork.org` and no name, description, fee, or referral. Left off the site. Add it to `communities.json` if you want it.
2. **Female Agency Owners fee.** Listed as Paid under Agency Owners and Free under Women Focused. The site shows **Paid**. Change `fee` if that's wrong.
3. **"Work Like a Girl" under Women Focused → Entrepreneurship** carries All Raise's description and URL (looks like a copy-paste slip). Treated as All Raise. The real Work Like A Girl entry (worklikeagirl.com) sits under General professional.

## Missing information (shown honestly on the site)

- No description: The Board, MKTGWMN
- No public link: StormKing, Re:Brand
- Fee not listed: Lenny's Newsletter, MKTGWMN, Work Like A Girl
- Joining details not listed: Malloy Industries (sheet said "Unknown"), Lenny's Newsletter, MKTGWMN, Work Like A Girl

## Small edits

- Notes that only said "Also listed under..." were dropped; the merge covers them.
- Your notes were lightly tidied for punctuation (for example "Free for mentors!" became "Free for mentors.").
- "Referral required." was removed from Mixing Board's description since the tag already says it.
- "At- Dawn" is written as "At Dawn".
