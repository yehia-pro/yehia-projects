using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace StudentHub
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            try
            {
                // Standalone native window mode pointing to Admin Dashboard
                string targetUrl = "https://yehia-projects.vercel.app/admin.html";
                string edgeArgs = string.Format("--app=\"{0}\" --window-size=1366,850", targetUrl);

                // 1. Try Microsoft Edge (built-in on every Windows 10/11)
                string edgePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe");
                if (!File.Exists(edgePath))
                {
                    edgePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe");
                }

                if (File.Exists(edgePath))
                {
                    Process.Start(edgePath, edgeArgs);
                    return;
                }

                // 2. Try Google Chrome
                string chromePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe");
                if (!File.Exists(chromePath))
                {
                    chromePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe");
                }

                if (File.Exists(chromePath))
                {
                    Process.Start(chromePath, edgeArgs);
                    return;
                }

                // 3. Fallback to default browser
                Process.Start(new ProcessStartInfo(targetUrl) { UseShellExecute = true });
            }
            catch (Exception ex)
            {
                MessageBox.Show("خطأ أثناء تشغيل لوحة الإدارة:\n" + ex.Message, "Student Hub Desktop", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
