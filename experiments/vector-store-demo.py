import os, getpass, faiss, numpy as np

from langchain.chat_models import init_chat_model
from langchain_community.vectorstores import FAISS, VectorStore
from langchain_community.docstore import InMemoryDocstore, document
from langchain_google_genai import GoogleGenerativeAIEmbeddings, GoogleVectorStore

if not os.environ.get("GOOGLE_API_KEY"):
  os.environ["GOOGLE_API_KEY"] = getpass.getpass("Enter API key for Google Gemini: ")

model = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
query_emb = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", task_type="RETRIEVAL_QUERY")
doc_emb = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001", task_type="RETRIEVAL_DOCUMENT")

# make vector store

questions = [
"""Details about possible tech careers"""
"""What career should I get into?""",
"""Details about possible tech jobs"""
"""Alright — let's talk jobs.

We could approach this from a few angles:

    Directly in your skillset — programming, simulations, graphics, OS-level work.

    Adjacent skills — stuff you could quickly pivot into because you have related knowledge.

    Long-term growth — jobs you might not be qualified for yet but could aim toward.

Since you’re a programmer interested in computer graphics, operating systems, AI, and simulations, here are some broad categories and concrete examples:
1. Graphics & Simulation

If you enjoy visual problem-solving and performance optimization:

    Game Engine Developer (Unreal Engine, Unity, Godot contributor)

    Graphics Programmer (shaders, rendering pipelines, Vulkan/OpenGL/DirectX)

    Simulation Engineer (physics, aerospace, scientific visualization)

    3D Tools Developer (Blender add-ons, CAD software)

    VR/AR Developer (spatial computing, interaction design)

2. Operating Systems & Systems Programming

If you like low-level control and performance:

    Kernel Developer (Linux, BSD, microkernels)

    Embedded Systems Engineer (IoT devices, automotive ECUs)

    Compiler/Language Tooling Engineer (LLVM, Rust, language runtimes)

    Systems Software Engineer (filesystems, device drivers, networking stacks)

3. AI & Applied Machine Learning

If you want to work on intelligent systems:

    AI Research Engineer (deep learning models, reinforcement learning)

    AI Tools Developer (frameworks, training platforms)

    Simulation for AI (training robots in virtual worlds, synthetic data generation)

    Computer Vision Engineer (image recognition, real-time tracking)

4. Adjacent & Creative Tech Roles

Because your interests mix creativity and code:

    Technical Artist (bridging art and code for games/films)

    Data Visualization Specialist (turning data into interactive graphics)

    Procedural Content Developer (generative art, procedural worlds)

    Interactive Systems Designer (museum installations, educational tech)

5. Pathway Roles for Career Growth

If you want to grow into research or leadership:

    R&D Software Engineer (tech innovation teams in aerospace, defense, or automotive)

    Simulation Lead (managing large simulation projects)

    Platform Engineer (building infrastructure for other developers)

    Open Source Maintainer (build a portfolio and network through projects)

If you want, I can also filter these into remote-friendly vs. in-person jobs or rank them by how much they use graphics vs. OS vs. AI skills so we can see your sweet spot.

Do you want me to focus on jobs you could get right now or jobs worth aiming for in the next 3–5 years?""",
"""Stephen Harper's tenure as Prime Minister of Canada (2006–2015) did not prioritize the direct construction of new housing units. Instead, his government focused on funding programs aimed at homelessness and affordable housing, often in partnership with provinces and municipalities.([The Harper Decade][1])

**Key Housing Initiatives Under Harper:**

1. **Investment in Affordable Housing (IAH):** Launched in 2011, the IAH program provided approximately $250 million annually to support affordable housing projects across Canada. While this was a significant increase from previous funding levels, it was considered insufficient to meet the country's housing needs .([The Harper Decade][1])

2. **Homelessness Partnering Strategy (HPS):** Initiated in 2007, the HPS aimed to prevent and reduce homelessness through community-based solutions. By 2013, the program had approved over $740 million for various projects, including the creation of more than 5,700 new shelter beds .([Canada.ca][2], [PR Newswire][3])

3. **Housing First Approach:** In 2014, the Harper government adopted the Housing First model, focusing on providing immediate, permanent housing to homeless individuals, followed by necessary support services. This approach was backed by studies demonstrating its effectiveness in reducing chronic homelessness .([PR Newswire][3])

**Conclusion:**

While Harper's government invested in programs supporting affordable housing and homelessness reduction, there is no specific data indicating the exact number of houses built during his tenure. The focus was more on funding and policy frameworks rather than direct construction. Therefore, it's not possible to provide a precise count of houses built under Stephen Harper's leadership.([Canada.ca][4])

[1]: https://www.theharperdecade.com/blog/2015/9/7/the-harper-decade-housing-first-but-affordable-housing-last?utm_source=chatgpt.com "The Harper Decade: Housing First, but affordable housing last/ La décennie Harper: Logement d’abord, mais logement abordable dernier"
[2]: https://www.canada.ca/en/news/archive/2013/10/harper-government-supports-housing-first-model-reduce-homelessness.html?utm_source=chatgpt.com "Harper Government supports Housing First model to reduce homelessness - Canada.ca"
[3]: https://www.prnewswire.com/news-releases/harper-government-supports-housing-first-model-to-reduce-homelessness-513158061.html?utm_source=chatgpt.com "Harper Government supports Housing First model to reduce homelessness"
[4]: https://www.canada.ca/en/news/archive/2014/12/harper-government-invests-housing-first-homelessness-initiatives-brandon-area-across-manitoba.html?utm_source=chatgpt.com "Harper Government invests in Housing First homelessness initiatives in the Brandon area and across Manitoba - Canada.ca"
""",
"""The `Input/output error` means your system doesn’t allow modifying the USB-C power role dynamically, either because of hardware limitations, a kernel restriction, or missing permissions. Let’s troubleshoot and work around this:

---

### 1. **Check Kernel and Hardware Support**

* Ensure your kernel supports USB-C Power Delivery role switching:

  ```bash
  uname -r
  ```

  For the Framework Laptop, using a recent Linux kernel (6.x or later) is recommended. Fedora usually keeps you up to date, but you can double-check.

---

### 2. **Try `cat` to Inspect Available Roles**

Verify the available roles supported by your USB-C port:

```bash
cat /sys/class/typec/port0/power_role
```

You may see something like `source`, `sink`, or `dual`. If it only shows `source`, your laptop might not support switching dynamically, or the feature may not be enabled.

---

### 3. **Force Re-Negotiation via `typeccli` or `udevadm` (Optional Package)**

* **Install `typec-tools`:**
  You can manage USB-C ports using `typec-tools`. Install it with:

  ```bash
  sudo dnf install typec-tools
  ```
* Then, use the `typec` command to list the ports and force a role:

  ```bash
  sudo typecctl list
  sudo typecctl set port0 sink
  ```

---

### 4. **Check Firmware Settings**

Some devices, including the Framework Laptop, allow USB-C power role preferences in the firmware/BIOS. To check:

1. Reboot your laptop and enter the BIOS/UEFI (usually by pressing `F2` or `Del` during boot).
2. Look for USB-C or Power Delivery settings.
3. Enable “Prefer Sink” or a similar setting if available.

---

### 5. **Cable and Port Behavior**

Sometimes, specific cables or port combinations affect role negotiation:

* Use a **different USB-C cable**, preferably one rated for USB-C PD (Power Delivery).
* Swap ports: Plug your Mac into a different USB-C port on the Framework.

---

### 6. **Manually Switch Roles Using Power Hub**

If your Framework laptop doesn’t support switching roles dynamically, you can use a **USB-C Power Delivery hub**. This device acts as an intermediary and forces your laptop to act as a sink (receiver) while supplying power from the Mac.

---

### If All Else Fails:

If these steps don’t resolve the issue, your Framework Laptop’s USB-C controller or firmware might not support this feature fully. You could:

1. Ensure you’re running the latest **firmware updates** for the Framework Laptop.
2. Use an external charger to directly power the Framework Laptop.

Let me know which step you’re at, and I can guide you further!
"""
]

faiss_index = faiss.IndexFlatL2(len(query_emb.embed_query("hi")))
vector_store: VectorStore = FAISS(
  index=faiss_index,
  embedding_function=doc_emb,
  docstore=InMemoryDocstore(),
  index_to_docstore_id={}
)

vector_store.add_documents([document.Document(page_content=q) for q in questions])

res = vector_store.similarity_search_with_score_by_vector(query_emb.embed_query("Details about possible tech careers"))
# res = vector_store.similarity_search_with_score()
res = [(doc.page_content[:15], score) for doc, score in res]
print(f"got {res}")

