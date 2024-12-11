## Contribution

This repository consists of three main folders:
- **android**: for Android application development.
- **web**: for web development.
- **api**: for API development.

### 1. Fork and Clone the Repository

**Fork this Repository**
   - Click the **Fork** button at the top-right corner of this repository page on GitHub, and fork it to your account.

**Create an Empty Folder for Cloning**
   - On your local computer, create an empty folder in your desired location to store this repository.

**Clone with Filter and Sparse Checkout**
   - Open your terminal or command prompt, navigate to the empty folder, and run:

     ```bash
     git clone --filter=blob:none --sparse <URL-of-your-forked-repo> .
     ```

**Enable the Folder You Want to Edit**
   - After cloning, select the folder you want to work on using one of the following commands:

   - **Android**
     ```bash
     git sparse-checkout set android
     ```
   
   - **API**
     ```bash
     git sparse-checkout set api
     ```
   
   - **Web**
     ```bash
     git sparse-checkout set web
     ```

### 2. Start Development

**Commit Message Format**
   - Use the following format for commit messages:
     - **FEAT**: for adding new features, e.g.:
       ```bash
       git commit -m "FEAT: Add login feature"
       ```
     - **FIX**: for fixing bugs, e.g.:
       ```bash
       git commit -m "FIX: Resolve input validation bug"
       ```
   - Use **TODO**: in code comments to mark items that still need work, e.g.:
     ```javascript
     // TODO: Add validation for email field
     ```

### 3. Submitting a Pull Request (PR)

**Push Branch to Your Fork**
   - Once you've finished making changes, push the branch to your forked repository on GitHub:
     ```bash
     git push origin main
     ```

**Create a Pull Request**
   - Open the GitHub page for your forked repository. There will be an option to create a **Pull Request** (PR) to the main repository.
   - Click **New Pull Request** and provide a description of the changes you made.

**Update PR if Needed**
   - If you make additional changes to the same branch, simply commit and push again. The PR will be automatically updated with the new changes.

### Syncing Tips
Ensure your branch is always up-to-date with the main branch in this repository to avoid unnecessary conflicts.